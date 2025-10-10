import { Router } from "express";
import { getUsers, createUser, loginUser } from "../controllers/userController";
import { adminOnly, authMiddleware } from "../middelware/auth";
import  User from "../models/User"

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);

// endast inloggade så de kan se sin profil
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const userId = (req as any).user.userId; // från token
        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(404).json({ error: "användare hittas inte" });
        res.json(user);
    } catch {
        res.status(500).json({ error: "kunde inte hämta profilen" });
    }
});

// endast admin

// så admin kan se andra användare
router.get("/all", authMiddleware, adminOnly, getUsers);

// så en admin kan göra en annan til admin
router.patch("/:id/make-admin", authMiddleware, adminOnly, async (req, res)=> {
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
});

// så en admin kan ta bort admin status från annan
router.patch("/:id/remove-admin", authMiddleware, adminOnly, async (req, res) => {
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
});

router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;

        // hitta användare som ska tas bort
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "användare hittas inte" });
        }

        // förhindra att en admin tar bort sig själv
        const loggedInUserId = (req as any).user.userId;
        if (user._id.toString() === loggedInUserId) {
            return res.status(400).json({ error: "du kan inte ta bort ditt eget konto" });
        }

        await User.findByIdAndDelete(id);

        res.json({ message: `användare ${user.name} har raderats` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "kunde inte radera användare" })
    }
});

export default router;
