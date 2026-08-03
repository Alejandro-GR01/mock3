import type { Request, Response, NextFunction } from "express";
import { findApiKeyByHash } from "../services/apikey.service.js";
import { sha256Hash } from "../utils/crypto.js";

const BEARER_PREFIX = "Bearer ";

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Missing or malformed Authorization header" });
    return;
  }

  const fullKey = authHeader.slice(BEARER_PREFIX.length);
  const keyHash = sha256Hash(fullKey);
  const apiKey = await findApiKeyByHash(keyHash);

  if (!apiKey) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid API key" });
    return;
  }

  req.userId = apiKey.userId;
  next();
}
