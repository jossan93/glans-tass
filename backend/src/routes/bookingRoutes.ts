import express from "express";
import { createBooking, deleteBooking, getUserBooking } from "../controllers/bookingController";
import { authMiddleware } from "../middelware/auth";

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getUserBooking);
router.delete("/:id", authMiddleware, deleteBooking);

export default router;
