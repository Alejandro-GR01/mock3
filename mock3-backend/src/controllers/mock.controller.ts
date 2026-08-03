import type { Request, Response } from "express";
import { createMock, getMockByIdAndUser, getMockByPath, getMocksByUserId, updateMock, deleteMock } from "../services/mock.service.js";
import { createMockSchema, updateMockSchema } from "../validations/mock.schema.js";
import { AppError, NotFoundError } from "../utils/errors.js";

export async function createMockController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const parsed = createMockSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    });
    return;
  }

  const mock = await createMock(clerkUserId, parsed.data);
  res.status(201).json({ data: mock });
}

export async function listMocksController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const mocks = await getMocksByUserId(clerkUserId);
  res.json({ data: mocks });
}

export async function getMockController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const id = req.params.id as string;
  const mock = await getMockByIdAndUser(id, clerkUserId);
  if (!mock) {
    throw new NotFoundError("Mock not found");
  }

  res.json({ data: mock });
}

export async function updateMockController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }

  const parsed = updateMockSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    });
    return;
  }

  const id = req.params.id as string;
  const mock = await updateMock(id, clerkUserId, parsed.data);
  res.json({ data: mock });
}

export async function deleteMockController(req: Request, res: Response): Promise<void> {
  const clerkUserId = req.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No user ID found" });
    return;
  }
  const id = req.params.id as string;
  try {
    await deleteMock(id, clerkUserId);
    res.json({ message: "Mock deleted successfully" });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.code, message: err.message });
    } else {
      console.error("[deleteMockController] Unexpected error:", err);
      res.status(500).json({ error: "INTERNAL_ERROR", message: "Failed to delete mock" });
    }
  }
}

export async function serveMock(req: Request, res: Response): Promise<void> {
  const rawPath = req.params.path;
  const path = Array.isArray(rawPath) ? rawPath.join("/") : String(rawPath);
  if (!path) {
    res.status(404).json({ error: "NOT_FOUND", message: "Mock path is required" });
    return;
  }

  const method = req.method.toUpperCase();
  const userId = req.userId as string;

  const mock = await getMockByPath(userId, path);

  if (!mock) {
    res.status(404).json({ error: "NOT_FOUND", message: "Mock not found" });
    return;
  }

  req.mockId = mock.id;

  const methods = mock.methods as Record<
    string,
    { status: number; headers: Record<string, string>; body: string }
  >;
  const methodConfig = methods[method];

  if (!methodConfig) {
    res
      .status(405)
      .json({ error: "METHOD_NOT_ALLOWED", message: `Method ${method} is not configured for this mock` });
    return;
  }

  if (methodConfig.headers) {
    for (const [key, value] of Object.entries(methodConfig.headers)) {
      res.setHeader(key, value);
    }
  }

  res.status(methodConfig.status);

  try {
    const body = JSON.parse(methodConfig.body);
    res.json(body);
  } catch {
    res.send(methodConfig.body);
  }
}
