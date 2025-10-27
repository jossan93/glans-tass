import { Response } from "express";
import Booking from "../models/Booking";
import Service from "../models/Service";
import { AuthRequest } from "../middelware/auth";

// skapa ny bokning
export const createBooking = async (req: AuthRequest, res: Response) => {
    console.log("POST /Booking hit", req.body);

    try {
        const { service: serviceId, date, notes } = req.body;
    //    const userId = req.user?.userId; // kräver auth-middleware

        if (!req.user?.userId) {
            console.warn("ej inloggad användare försökte boka");
            return res.status(401).json({ error: "Ej inloggad" });
        }

        if (!serviceId || !date) {
            console.warn("saknar serviceId eller date i requst body");
            return res.status(400).json({ error: "saknar serviceid eller date" });
        }

        // kolla att tjänsten finns
        const service = await Service.findById(serviceId);
        if (!service) {
            console.warn("stjänst hittades inte", serviceId);
            return res.status(404).json({ error: "tjänsten hittades inte" });
        }

        const newBooking = await Booking.create({
            user: req.user!.userId,
            service: serviceId,
            date,
            notes,
            status: "pending"
        });
        console.log("Ny bokning sparad", newBooking);

        res.status(201).json({ message: "bokning skapad", booking: newBooking });
    } catch (error: any) {
        console.error("fel vid skapande av bokining", error.message || error);
        res.status(500).json({ error: "kunde inte skapa bokning", details: error.message || error });
    }
};

// hämmta alla bokningar för inloggad användare
export const getUserBooking = async (req: AuthRequest, res: Response) => {
    try {
    //    const userId = req.user?.userId;
    //    if (!userId) return res.status(401).json({ error: "ej inloggad" });

        const bookings = await Booking.find({ user: req.user!.userId })
        .populate("service", "name price duration")
        .sort({ date: 1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "kunde inte hämta bokningar" });
    }
};

// ta bort bokning
export const deleteBooking = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ error: "Ej inloggad" });
        }

        //const userId = req.user?.userId;
        const { id } = req.params;

        const booking = await Booking.findOneAndDelete({ _id: id, user: req.user.userId });
        if (!booking) {
            return res.status(404).json({ error: "bokningen hittades inte" });
        }

        res.json({ message: "bokning borttagen" });
    } catch (error) {
        res.status(500).json({ error: "kunde inte ta bort bokning" });
    }
};

export const getAvailableTimes = async (req: AuthRequest, res: Response) => {
    try {
        //const { date, serviceId } = req.query;
        // tillåt både query och body
        const serviceId = (req.query.serviceId as string) || req.body.serviceId;
        const date = (req.query.date as string) || req.body.date;

        if (!date || !serviceId) {
            return res.status(400).json({ message: "saknar date eller serviceId"});
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "service hittades inte"});
        }

        const DEFAULT_DURATION = 30; // minuter - används om tjänsten saknar duration
        const serviceDuration = service.duration || DEFAULT_DURATION;

        const selectedDate = new Date(date as string);
        //const startOfDay = new Date(selectedDate.setHours(9, 0, 0, 0));
        //const endOfDay = new Date(selectedDate.setHours(18, 0 ,0, 0));

        // skapa nya oberoende datumobject, annars muteras samma datum
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(9, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(18, 0, 0, 0);

        // hämta alla bokningar för samma dag
        const bookings = await Booking.find({
            date: { $gte: startOfDay, $lte: endOfDay },
        })
        .populate("service", "duration")
        .sort({ date: 1 });

        // skapa 15minutersintervaller under dagen
        const availableSlots: string[] = [];
        let currentTime = new Date(startOfDay);

        while (currentTime.getTime() + serviceDuration * 60000 <= endOfDay.getTime()) {
            const currentEnd = new Date(currentTime.getTime() + serviceDuration * 60000);

            // kolla om den här slotten krockar med någon bokning
            const overlapping = bookings.some((booking) => {
                const bookingStart = new Date(booking.date);

                const bookedDuration =
                    (booking.service && (booking.service as any).duration) || DEFAULT_DURATION;
                const bookingEnd = new Date(bookingStart.getTime() + bookedDuration * 60000);

                // överlappnigsLogik
                // en slot överlappar en bokning om slot.star < bookingEnd && soltEnd > bookingStart
                return currentTime < bookingEnd && currentEnd > bookingStart;
                /*
                const bookingEnd = new Date(bookingStart.getTime() + (((bookingStart.service as any)?.duration) || 30) * 60000);

                // om tiderna överlappar
                return (
                    (currentTime >= bookingStart && currentTime < bookingEnd) ||
                    (currentEnd > bookingStart && currentEnd <= bookingEnd)
                    );*/
            });

            if (!overlapping) {
                availableSlots.push(
                    currentTime.toLocaleDateString("sv-SE", { hour: "2-digit", minute: "2-digit" })
                );
            }

            // gå vidare 15minuter framåt
            currentTime = new Date(currentTime.getTime() + 15 * 60000);
        }

        res.json({ availableSlots });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "kunde inte hämta tillgänliga tider" });
    }
};
