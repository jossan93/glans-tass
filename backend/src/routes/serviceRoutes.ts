import express from "express";
import {
  createServices,
  getAllServices,
  getServiceById,
} from "../controllers/serviceController";
import { adminOnly, authMiddleware } from "../middelware/auth";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", authMiddleware, adminOnly, createServices); // om vill admin ska kunna lägga til tjänster

export default router;
