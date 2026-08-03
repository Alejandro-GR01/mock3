import { db } from "../db/index.js";
import { sql } from "drizzle-orm";

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

export function getHealthStatus() {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}