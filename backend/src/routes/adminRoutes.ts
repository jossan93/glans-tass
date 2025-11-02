import express from "express";
import { authMiddleware, adminOnly } from "../middelware/auth";
import {
    getAllUsers,
    makeAdmin,
    removeAdmin,
    deleteUser,
    adminCreateUser,
} from "../controllers/adminController";

const router = express.Router();

// Alla routes kräver inloggning som admin
router.use(authMiddleware, adminOnly);

// hämmta alla användare
router.get("/users", getAllUsers);

// admin skapar en ny användare
router.post("/users", adminCreateUser)

// gör user till admin
router.put("/make-admin/:id", makeAdmin);

// ta bort admin roll
router.put("/remove-admin/:id", removeAdmin);

// ta bort användare
router.delete("/delete-user/:id", deleteUser);

export default router;
