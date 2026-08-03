import type { Request, Response, NextFunction } from "express";

/**
 * Per-user rate limiter for auth endpoints (e.g. /api/auth/sync).
 *
 * Why per-user and not global?
 * - Each user has their own JWT → we can identify them
 * - 10 req/min per user is generous (sync is called once on login)
 * - Global limit would block other users if one abuses it
 *
 * Why in-memory?
 * - Single instance (Back4app free tier) → simple Map is fine
 * - No DB overhead for auth endpoints
 * - Same pattern as healthRateLimit
 */

const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000; // 1 minute

const userWindows = new Map<string, { count: number; windowStart: number }>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userWindows) {
    if (now - value.windowStart > WINDOW_MS * 2) {
      userWindows.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function authRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const userId = req.userId;
  if (!userId) {
    next();
    return;
  }

  const now = Date.now();
  const entry = userWindows.get(userId);

  // New window
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    userWindows.set(userId, { count: 1, windowStart: now });
    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", MAX_REQUESTS - 1);
    res.setHeader("X-RateLimit-Reset", new Date(now + WINDOW_MS).toISOString());
    next();
    return;
  }

  // Same window
  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);
    res.setHeader("Retry-After", retryAfter);
    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", 0);
    res.setHeader("X-RateLimit-Reset", new Date(entry.windowStart + WINDOW_MS).toISOString());
    res.status(429).json({
      error: "RATE_LIMIT_EXCEEDED",
      message: `Too many auth requests. Try again in ${retryAfter}s`,
    });
    return;
  }

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", MAX_REQUESTS - entry.count);
  res.setHeader("X-RateLimit-Reset", new Date(entry.windowStart + WINDOW_MS).toISOString());
  next();
}
