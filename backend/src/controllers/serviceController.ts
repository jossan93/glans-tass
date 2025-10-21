import { Request, Response } from "express"
import Service from "../models/Service"

// hämta alla tjänster
export const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await Service.find({ isActive: true }).sort({ animalType: 1, name: 1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "kunde inte hämta tjänster" });
    }
};

// skapa ny tjänst ( som admin skulle kunna lägga till )
export const createServices = async (req: Request, res: Response) => {
    try {
        const { name, description, price, duration, animalType } = req.body;

        const newService = await Service.create({
            name,
            description,
            price,
            duration,
            animalType
        });

        res.status(201).json({ message: "tjänst skapad", service: newService });
    } catch (error) {
        res.status(500).json({ error: "kunde inte skapa tjänst" });
    }
};
