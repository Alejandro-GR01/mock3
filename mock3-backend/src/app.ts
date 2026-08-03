import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env.js";
import { corsConfig } from "./config/cors.config.js";
import routes from "./routes/index.js";
import mockPublicRoutes from "./routes/mock-public.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { startCleanupJob } from "./jobs/cleanupLogs.js";

const PORT = env.PORT;
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`❌ Invalid PORT: ${PORT} (must be an integer between 1 and 65535)`);
  process.exit(1);
}

const app = express();

// Trust first proxy (Back4app uses reverse proxy)
// Without this, req.ip returns the proxy's IP, not the client's
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((_req, _res, next) => {
  console.log(`${new Date().toISOString()} ${_req.method} ${_req.path}`);
  next();
});

app.use(mockPublicRoutes);

app.use(cors(corsConfig));

app.use(clerkMiddleware());

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Mock3 backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  startCleanupJob();
});

export default app;
