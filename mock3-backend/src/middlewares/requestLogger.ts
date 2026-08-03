import type { Request, Response, NextFunction } from "express";
import { db } from "../db/index.js";
import { requestLogs } from "../db/schema.js";

export async function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  res.on("finish", async () => {
    try {
      const userId = req.userId;
      const mockId = req.mockId;
      if (!userId || !mockId) return;

      await db.insert(requestLogs).values({
        userId,
        mockId,
        method: req.method,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]?.slice(0, 500) ?? null,
      });
    } catch (error) {
      console.error("Failed to log request:", error);
    }
  });

  next();
}
