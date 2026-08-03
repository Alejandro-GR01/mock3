import type { CorsOptions } from "cors";
import { env } from "./env.js";

const useHost = process.argv.includes("--host");

const whiteList: (string | undefined)[] = [env.FRONTEND_URL];

// --host: cualquier origin se agrega dinámicamente al whitelist
if (useHost) {
  console.log("[CORS] Open mode — any origin will be allowed");
} else {
  console.log(`[CORS] Strict mode — only ${env.FRONTEND_URL}`);
}

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else if (useHost) {
      // Modo --host: agregar origin al whitelist dinámicamente
      whiteList.push(origin);
      console.log(`[CORS] Added to whitelist → ${origin}`);
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};
