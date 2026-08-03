import { Router } from "express";
import { apiKeyAuth } from "../middlewares/apiKeyAuth.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { requestLogger } from "../middlewares/requestLogger.js";
import { serveMock } from "../controllers/mock.controller.js";

const router = Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

router.all("/mocks/{*path}", apiKeyAuth, rateLimiter, requestLogger, serveMock);
router.all("/mocks", apiKeyAuth, rateLimiter, requestLogger, serveMock);

export default router;
