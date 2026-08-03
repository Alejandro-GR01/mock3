import { Router } from "express";
import { requireAuth, extractUser } from "../middlewares/clerkAuth.js";
import { authRateLimit } from "../middlewares/authRateLimit.js";
import { syncUserController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/sync", requireAuth, extractUser, authRateLimit, syncUserController);

export default router;
