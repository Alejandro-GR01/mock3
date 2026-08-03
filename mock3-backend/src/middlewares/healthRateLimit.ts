import type { Request, Response, NextFunction } from "express";

/**
 * GLOBAL rate limiter for health/keepalive endpoints.
 *
 * Why GLOBAL (not per-IP)?
 * - Per-IP is useless against distributed attacks (100 IPs × 4 req = bypassed)
 * - GitHub Actions only hits 1 req every 10 min → never reaches 5/min
 * - If GitHub Actions gets 429, service is still alive ← that's the goal
 *
 * Why a separate limiter (not the DB-based one)?
 * - Health endpoints are HIT constantly by keepalive cron
 * - We don't want to write to request_logs for every ping
 * - In-memory is fast, no DB overhead
 * - Single instance → simple counter is fine
 *
 * Rules:
 * - 5 requests per minute TOTAL (all IPs combined)
 * - Cleanup every 2 hours to prevent stale data
 */

const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

let count = 0;
let windowStart = Date.now();

export function healthRateLimit(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  const now = Date.now();

  // New window
  if (now - windowStart > WINDOW_MS) {
    count = 1;
    windowStart = now;
    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", MAX_REQUESTS - 1);
    res.setHeader("X-RateLimit-Reset", new Date(now + WINDOW_MS).toISOString());
    next();
    return;
  }

  // Same window
  count++;

  if (count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((windowStart + WINDOW_MS - now) / 1000);
    res.setHeader("Retry-After", retryAfter);
    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", 0);
    res.setHeader("X-RateLimit-Reset", new Date(windowStart + WINDOW_MS).toISOString());
    res.status(429).json({
      error: "RATE_LIMIT_EXCEEDED",
      message: `Too many requests to health endpoint. Try again in ${retryAfter}s`,
    });
    return;
  }

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", MAX_REQUESTS - count);
  res.setHeader("X-RateLimit-Reset", new Date(windowStart + WINDOW_MS).toISOString());
  next();
}
