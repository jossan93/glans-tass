import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "ingen token skickad" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "ogiltig token" });
  }
};

// endast admin
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "endast admin har tillgång" });
  }
  next();
};
