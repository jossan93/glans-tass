import { Response } from "express";
import Booking from "../models/Booking";
import Service from "../models/Service";
import { AuthRequest } from "../middelware/auth";

// skapa ny bokning
export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { serviceId, date, notes } = req.body;
    //    const userId = req.user?.userId; // kräver auth-middleware

        if (!req.user?.userId) {
            return res.status(401).json({ error: "Ej inloggad" });
        }

        // kolla att tjänsten finns
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: "tjänsten hittades inte" });
        }

        const newBooking = await Booking.create({
            user: req.user!.userId,
            service: serviceId,
            date,
            notes,
            status: "pending"
        });

        res.status(201).json({ message: "bokning skapad", booking: newBooking });
    } catch (error) {
        res.status(500).json({ error: "kunde inte skapa bokning" });
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
