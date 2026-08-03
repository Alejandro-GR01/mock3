import type { Request, Response } from "express";
import { getHealthStatus, checkDatabaseConnection } from "../services/health.service.js";

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const health = getHealthStatus();
  const dbOk = await checkDatabaseConnection();
  res.status(200).json({
    ...health,
    database: dbOk ? "connected" : "disconnected",
  });
}