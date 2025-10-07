import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if ( !authHeader) {
        return res.status(401).json({ error: "ingen token sickad" });

    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "hemlig nyckel");
        (req as any).user = decoded;
        next();
        } catch (err) {
            res.status(403).json({ error: "ogiltig token" });
        }
    };