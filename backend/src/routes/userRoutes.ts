import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";
import { adminOnly, authMiddleware, AuthRequest} from "../middelware/auth";
import  User from "../models/User"

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);

// endast inloggade så de kan se sin profil
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const userId = (req as any).user.userId; // från token
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ error: "användare hittas inte" });
        res.json(user);
    } catch {
        res.status(500).json({ error: "kunde inte hämta profilen" });
    }
});

export default router;
