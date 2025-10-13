import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middelware/auth";

// hämta alla användare
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "kunde inte hämta användare" });
    }
};

// så en admin kan göra en annan til admin
export const makeAdmin = async (req: AuthRequest, res: Response)=> {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "Användare hittas inte" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ error: `${user.name} är redan admin` });
        }

        user.role = "admin";
        await user.save();

        res.json({ message: `${user.name} är nu admin`, user });
    } catch (error) {
        res.status(500).json({ error: "kunde inte uppdatera användarroll" });
}
};

// så en admin kan ta bort admin status från annan
export const removeAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // hitta användaren
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "användare hittas inte" });
        }

        // kolla om användaren redan är vanlig user
        if (user.role === "user") {
            return res.status(400)
        }

        // uppdatera roll till user
        user.role = "user";
        await user.save();

        res.json({ message: `${user.name} är inte längre admin`, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "kunde inte uppdatera användarroll" });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // hitta användare som ska tas bort
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "användare hittas inte" });
        }

        // förhindra att en admin tar bort sig själv
        const loggedInUserId = req.user?.userId;
        if (user._id.toString() === loggedInUserId) {
            return res.status(400).json({ error: "du kan inte ta bort ditt eget konto" });
        }

        await User.findByIdAndDelete(id);

        res.json({ message: `användare ${user.name} har raderats` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "kunde inte radera användare" })
    }
};
