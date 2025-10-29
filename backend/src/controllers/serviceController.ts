import { Request, Response } from "express"
import Service from "../models/Service"

// hämta alla tjänster
export const getAllServices = async (req: Request, res: Response) => {
    try {
        const { search }= req.query;

        let query: any = {isActive: true};

        if (search && typeof search === "string" && search.trim() !== "") {
            const searchRegex = new RegExp(search, "i"); // i är inte case sensitive
            query.$or = [
                 {name: searchRegex },
                 {description: searchRegex},
                 { animalType: searchRegex}
                  
            ];
    
        }

        const services = await Service.find(query).sort({ animalType: 1, name: 1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "kunde inte hämta tjänster" });
    }
};

export const getServiceById = async (req: Request, res: Response) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "tjänst hittades inte" });
        }
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: "fel vid hämtning av tjänst" });
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
