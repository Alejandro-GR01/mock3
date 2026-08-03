import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import mockRoutes from "./mock.routes.js";
import apikeyRoutes from "./apikey.routes.js";
import usageRoutes from "./usage.routes.js";
import userRoutes from "./user.routes.js";
import keepaliveRoutes from "./keepalive.routes.js";

const router = Router();
router.use(healthRoutes);
router.use(keepaliveRoutes);
router.use(authRoutes);
router.use(apikeyRoutes);
router.use(mockRoutes);
router.use(usageRoutes);
router.use(userRoutes);
export default router;