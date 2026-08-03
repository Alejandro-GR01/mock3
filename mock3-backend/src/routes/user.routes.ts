import { Router } from "express";
import { requireAuth, extractUser } from "../middlewares/clerkAuth.js";
import { getMeController, deleteMeController } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", requireAuth, extractUser, getMeController);
router.delete("/me", requireAuth, extractUser, deleteMeController);

export default router;
