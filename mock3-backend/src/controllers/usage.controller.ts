import type { Request, Response } from "express";
import { getUsageStats, getCurrentUsage, getMockUsageRanking } from "../services/usage.service.js";

export async function getUsageStatsController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const stats = await getUsageStats(clerkUserId);
  res.json({ data: stats });
}

export async function getCurrentUsageController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const usage = await getCurrentUsage(clerkUserId);
  res.json({ data: usage });
}

export async function getMockUsageRankingController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const ranking = await getMockUsageRanking(clerkUserId);
  res.json({ data: ranking });
}
