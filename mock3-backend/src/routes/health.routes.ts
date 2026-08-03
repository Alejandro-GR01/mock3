import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";
import { healthRateLimit } from "../middlewares/healthRateLimit.js";

const router = Router();
router.get("/health", healthRateLimit, healthCheck);
export default router;