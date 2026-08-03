import type { Request, Response } from "express";
import { getMe, deleteUser } from "../services/user.service.js";

export async function getMeController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const me = await getMe(clerkUserId);
  if (!me) {
    res.status(404).json({ error: "USER_NOT_FOUND", message: "User not found" });
    return;
  }

  res.json({ data: me });
}

export async function deleteMeController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }
  await deleteUser(clerkUserId);
  res.status(204).send();
}
