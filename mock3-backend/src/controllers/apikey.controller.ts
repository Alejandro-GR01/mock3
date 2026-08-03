import type { Request, Response } from "express";
import {
  deleteApiKey,
  generateApiKey,
  getApiKeysByUserId,
  regenerateApiKey,
} from "../services/apikey.service.js";
import { createApiKeySchema } from "../validations/apikey.schema.js";

export async function generateApiKeyController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const parsed = createApiKeySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: parsed.error.message });
    return;
  }

  const result = await generateApiKey(clerkUserId, parsed.data.name, parsed.data.expiresInHours);
  res.status(201).json({ data: result });
}

export async function listApiKeysController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const keys = await getApiKeysByUserId(clerkUserId);
  res.json({ data: keys });
}

export async function regenerateApiKeyController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const id = req.params.id as string;
  const result = await regenerateApiKey(id, clerkUserId);

  if (!result) {
    res.status(404).json({ error: "NOT_FOUND", message: "API key not found" });
    return;
  }

  if ("error" in result) {
    res.status(400).json({ error: "KEY_EXPIRED", message: "Cannot regenerate an expired API key" });
    return;
  }

  res.json({ data: result });
}

export async function deleteApiKeyController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const id = req.params.id as string;
  const deleted = await deleteApiKey(id, clerkUserId);

  if (!deleted) {
    res.status(404).json({ error: "NOT_FOUND", message: "API key not found" });
    return;
  }

  res.status(204).send();
}
