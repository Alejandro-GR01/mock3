import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { healthRateLimit } from "../middlewares/healthRateLimit.js";

const router = Router();

router.get("/keepalive", healthRateLimit, async (_req, res) => {
  try {
    await db.select({ id: users.id }).from(users).limit(1);
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

export default router;
