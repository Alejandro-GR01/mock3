import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.code, message: err.message });
    return;
  }

  if (err.name === "ZodError") {
    res.status(400).json({ error: "VALIDATION_ERROR", message: err.message });
    return;
  }

  res.status(500).json({
    error: "INTERNAL_ERROR",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
}