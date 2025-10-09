import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "E-postadressen används redan" });
        }
        const HashedPassword = await bcrypt.hash(password, 10);

        const newUser =  new User({ 
            name, 
            email, 
            password: HashedPassword, 
        });

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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "fel epost eller lösenord" });
        }

        // skapa JWT-token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "hemlig nyckel",
            { expiresIn: "2H" }
        );

        res.json({ message: "inloggning lyckades", token });
    } catch (error) {
        res.status(500).json({ error: "kunde inte logga in" });
    }
    
};