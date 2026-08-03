import type { Request, Response, NextFunction } from "express";
import { and, eq, count, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import { requestLogs } from "../db/schema.js";

const RATE_LIMIT = 300;
const WINDOW_HOURS = 1;

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    next();
    return;
  }

  const result = await db
    .select({ count: count().mapWith(Number) })
    .from(requestLogs)
    .where(
      and(
        eq(requestLogs.userId, userId),
        gt(requestLogs.timestamp, new Date(Date.now() - 60 * 60 * 1000)),
      ),
    );

  const requestCount = result[0]?.count ?? 0;

  if (requestCount >= RATE_LIMIT) {
    res.status(429).json({
      error: "RATE_LIMIT_EXCEEDED",
      message: "You have reached the limit of 300 requests per hour",
    });
    return;
  }

  res.setHeader("X-RateLimit-Limit", RATE_LIMIT);
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(0, RATE_LIMIT - requestCount - 1),
  );
  res.setHeader(
    "X-RateLimit-Reset",
    new Date(Date.now() + 3600000).toISOString(),
  );

  next();
}
