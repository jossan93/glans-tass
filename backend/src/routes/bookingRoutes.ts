console.log("booking routes loaded");
import express from "express";
import {
  createBooking,
  deleteBooking,
  getUserBooking,
  getAvailableTimes,
} from "../controllers/bookingController";
import { authMiddleware } from "../middelware/auth";

const router = express.Router();

// Lediga tider
router.get("/available", getAvailableTimes);

router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getUserBooking);
router.delete("/:id", authMiddleware, deleteBooking);

export default router;
