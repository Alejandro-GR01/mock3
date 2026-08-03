import type { CorsOptions } from "cors";
import { env } from "./env.js";

const corsOpen = process.argv.includes("--cors-open");

// El browser NUNCA manda el header Origin con trailing slash, pero FRONTEND_URL
// en el .env puede tenerlo → normalizamos antes de comparar (strict mode).
const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

const whiteList: string[] = [normalizeUrl(env.FRONTEND_URL)];

// --cors-open: cualquier origin se agrega dinámicamente al whitelist
if (corsOpen) {
  console.log("[CORS] Open mode — any origin will be allowed");
} else {
  console.log(`[CORS] Strict mode — only ${normalizeUrl(env.FRONTEND_URL)}`);
}

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else if (corsOpen) {
      // Modo --cors-open: agregar origin al whitelist dinámicamente
      whiteList.push(origin);
      console.log(`[CORS] Added to whitelist → ${origin}`);
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};
