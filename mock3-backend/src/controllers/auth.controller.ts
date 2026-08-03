import type { Request, Response } from "express";
import { syncUser } from "../services/user.service.js";

export async function syncUserController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const user = await syncUser(clerkUserId);
  res.json({ data: user });
}
