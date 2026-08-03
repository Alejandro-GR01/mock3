import { clerkMiddleware, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

export const requireAuth = clerkMiddleware();

export function extractUser(req: Request, _res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  req.userId = auth.userId ?? undefined;
  next();
}
