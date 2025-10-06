import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "kunde inte hämta användare" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const newUser =  new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: "kunde inte skapa användare" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        //kolla om användaren finns
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "fel epost eller lösenord" });
        }

        // jämföra lösenord

        // skapa JWT-token
    }

  
};