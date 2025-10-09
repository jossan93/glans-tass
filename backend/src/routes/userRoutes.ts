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
        const user = await User.findByIdAndUpdate(
            id,
            { role: "admin" },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "Användare hittas inte" });
        }

        res.json({ message: `${user.name} är nu admin`, user });
    } catch (error) {
        res.status(500).json({ error: "kunde inte uppdatera användarroll" });
}
});

export default router;
