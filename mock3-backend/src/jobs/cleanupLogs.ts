import { lt } from "drizzle-orm";
import { db } from "../db/index.js";
import { requestLogs } from "../db/schema.js";

const RETENTION_MS = 24 * 60 * 60 * 1000;
const INTERVAL_MS = 24 * 60 * 60 * 1000;

export async function cleanupOldLogs(): Promise<void> {
  await db
    .delete(requestLogs)
    .where(lt(requestLogs.timestamp, new Date(Date.now() - RETENTION_MS)));

  console.log("[Cleanup] Deleted old request logs");
}

export function startCleanupJob(): void {
  setInterval(cleanupOldLogs, INTERVAL_MS);
  console.log("[Cleanup] Started request logs cleanup job (every 24 hours)");
}
