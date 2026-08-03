import { Router } from "express";
import { requireAuth, extractUser } from "../middlewares/clerkAuth.js";
import {
  createMockController,
  listMocksController,
  getMockController,
  updateMockController,
  deleteMockController,
} from "../controllers/mock.controller.js";

const router = Router();

router.post("/mocks", requireAuth, extractUser, createMockController);
router.get("/mocks", requireAuth, extractUser, listMocksController);
router.get("/mocks/:id", requireAuth, extractUser, getMockController);
router.put("/mocks/:id", requireAuth, extractUser, updateMockController);
router.delete("/mocks/:id", requireAuth, extractUser, deleteMockController);

export default router;
