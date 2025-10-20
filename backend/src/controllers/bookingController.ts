import { Request, Response } from "express";
import Booking from "../models/Booking";
import Service from "../models/Service";
import { error } from "console";

// skapa ny bokning
export const createBooking = async (req: Request, res: Response) => {
    try {
        const { serviceId, date, notes } = req.body;
        const userId = req.user?.userId; // kräver auth-middleware

        if (!userId) return res.status(401).json({ error: "Ej inloggad" });

        // kolla att tjänsten finns
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: "tjänsten hittades inte" });
        }

        const booking = await Booking.create({
            userId,
            serviceId,
            date,
            notes,
        });

        res.status(500).json({ error: "kunde inte skapa bokning" });
    }
};

// hämmta alla bokningar för inloggad användare
export const getUserBooking = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "ej inloggad" });

        const bookings = await Booking.find({ userId })
        .populate("serviceID", "name price duration")
        .sort({ date: 1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "kunde inte hämta bokningar" });
    }
};

// ta bort bokning
export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        const booking = await Booking.findOneAndDelete({ _id: id, userId });
        if (!booking) {
            return res.status(404).json({ error: "bokningen hittades inte" });
        }

        res.json({ message: "bokning borttagen" });
    } catch (error) {
        res.status(500).json({ error: "kunde inte ta bort bokning" });
    }
};