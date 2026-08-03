import { Router } from "express";
import { requireAuth, extractUser } from "../middlewares/clerkAuth.js";
import {
  deleteApiKeyController,
  generateApiKeyController,
  listApiKeysController,
  regenerateApiKeyController,
} from "../controllers/apikey.controller.js";

const router = Router();

router.post("/api-keys", requireAuth, extractUser, generateApiKeyController);
router.get("/api-keys", requireAuth, extractUser, listApiKeysController);
router.post("/api-keys/:id/regenerate", requireAuth, extractUser, regenerateApiKeyController);
router.delete("/api-keys/:id", requireAuth, extractUser, deleteApiKeyController);

export default router;
