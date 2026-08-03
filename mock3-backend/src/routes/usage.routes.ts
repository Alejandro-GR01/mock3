import { Router } from "express";
import { requireAuth, extractUser } from "../middlewares/clerkAuth.js";
import {
  getUsageStatsController,
  getCurrentUsageController,
  getMockUsageRankingController,
} from "../controllers/usage.controller.js";

const router = Router();

router.get("/usage", requireAuth, extractUser, getUsageStatsController);
router.get("/usage/current", requireAuth, extractUser, getCurrentUsageController);
router.get("/usage/mocks", requireAuth, extractUser, getMockUsageRankingController);

export default router;
