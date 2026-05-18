import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "fallback_secret";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: "Token inválido." });
      return;
    }
    req.user = user;
    next();
  });
};
