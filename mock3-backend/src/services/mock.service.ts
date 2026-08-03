import { and, eq, count, ilike } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { mocks, users } from "../db/schema.js";
import { AppError, NotFoundError } from "../utils/errors.js";
import type { CreateMockInput, UpdateMockInput } from "../validations/mock.schema.js";

type MethodConfig = {
  status: number;
  headers: Record<string, string>;
  body: string;
};

function buildDefaultMethodConfig(): MethodConfig {
  return {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: "{}",
  };
}

function buildMethodsJson(methods: string[]): Record<string, MethodConfig> {
  const config: Record<string, MethodConfig> = {};
  for (const method of methods) {
    config[method] = buildDefaultMethodConfig();
  }
  return config;
}

export async function createMock(clerkUserId: string, input: CreateMockInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const [countResult] = await db
    .select({ count: count().mapWith(Number) })
    .from(mocks)
    .where(and(eq(mocks.userId, user.id), eq(mocks.isActive, true)));

  if (countResult.count >= user.maxSlots) {
    throw new AppError(
      "You have reached the maximum number of mocks for the free tier",
      403,
      "FREE_TIER_LIMIT_REACHED",
    );
  }

  // Check for duplicate name among active mocks
  const existingByName = await db.query.mocks.findFirst({
    where: and(
      eq(mocks.userId, user.id),
      ilike(mocks.name, input.name),
      eq(mocks.isActive, true),
    ),
  });
  if (existingByName) {
    throw new AppError(
      "A mock with this name already exists",
      409,
      "MOCK_NAME_DUPLICATE",
    );
  }

  // Check for duplicate path among active mocks
  const existingByPath = await db.query.mocks.findFirst({
    where: and(
      eq(mocks.userId, user.id),
      eq(mocks.path, input.path),
      eq(mocks.isActive, true),
    ),
  });
  if (existingByPath) {
    throw new AppError(
      "A mock with this path already exists",
      409,
      "MOCK_PATH_DUPLICATE",
    );
  }

  const slug = nanoid(12);
  const methodsJson = buildMethodsJson(input.methods);

  try {
    const [created] = await db
      .insert(mocks)
      .values({
        userId: user.id,
        slug,
        name: input.name,
        path: input.path,
        methods: methodsJson,
      })
      .returning();

    return created;
  } catch (err: unknown) {
    // PG unique violation — safety net for race conditions
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      const constraint = "constraint" in err ? String(err.constraint) : "";
      if (constraint === "uq_mock_name_active") {
        throw new AppError("A mock with this name already exists", 409, "MOCK_NAME_DUPLICATE");
      }
      if (constraint === "uq_mock_path_active") {
        throw new AppError("A mock with this path already exists", 409, "MOCK_PATH_DUPLICATE");
      }
    }
    throw err;
  }
}

export async function getMocksByUserId(clerkUserId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return db.query.mocks.findMany({
    where: and(eq(mocks.userId, user.id), eq(mocks.isActive, true)),
    orderBy: (mocks, { desc }) => [desc(mocks.createdAt)],
  });
}

export async function getMockByIdAndUser(id: string, clerkUserId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const mock = await db.query.mocks.findFirst({
    where: and(eq(mocks.id, id), eq(mocks.userId, user.id)),
  });

  return mock ?? null;
}

export async function updateMock(id: string, clerkUserId: string, input: UpdateMockInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const existing = await db.query.mocks.findFirst({
    where: and(eq(mocks.id, id), eq(mocks.userId, user.id)),
  });
  if (!existing) {
    throw new NotFoundError("Mock not found");
  }

  if (!existing.isActive) {
    throw new AppError("Cannot update a deleted mock", 400, "MOCK_DELETED");
  }

  // Check for duplicate name if name is being changed
  if (input.name !== undefined && input.name !== existing.name) {
    const duplicateName = await db.query.mocks.findFirst({
      where: and(
        eq(mocks.userId, user.id),
        ilike(mocks.name, input.name),
        eq(mocks.isActive, true),
      ),
    });
    if (duplicateName) {
      throw new AppError(
        "A mock with this name already exists",
        409,
        "MOCK_NAME_DUPLICATE",
      );
    }
  }

  // Check for duplicate path if path is being changed
  if (input.path !== undefined && input.path !== existing.path) {
    const duplicatePath = await db.query.mocks.findFirst({
      where: and(
        eq(mocks.userId, user.id),
        eq(mocks.path, input.path),
        eq(mocks.isActive, true),
      ),
    });
    if (duplicatePath) {
      throw new AppError(
        "A mock with this path already exists",
        409,
        "MOCK_PATH_DUPLICATE",
      );
    }
  }

  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.path !== undefined) updateData.path = input.path;
  if (input.methods !== undefined) {
    if (Array.isArray(input.methods)) {
      updateData.methods = buildMethodsJson(input.methods);
    } else {
      updateData.methods = input.methods;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return existing;
  }

  try {
    const [updated] = await db
      .update(mocks)
      .set(updateData)
      .where(and(eq(mocks.id, id), eq(mocks.userId, user.id)))
      .returning();

    return updated;
  } catch (err: unknown) {
    // PG unique violation — safety net for race conditions
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      const constraint = "constraint" in err ? String(err.constraint) : "";
      if (constraint === "uq_mock_name_active") {
        throw new AppError("A mock with this name already exists", 409, "MOCK_NAME_DUPLICATE");
      }
      if (constraint === "uq_mock_path_active") {
        throw new AppError("A mock with this path already exists", 409, "MOCK_PATH_DUPLICATE");
      }
    }
    throw err;
  }
}

export async function getMockByPath(userId: string, path: string) {
  return db.query.mocks.findFirst({
    where: and(eq(mocks.userId, userId), eq(mocks.path, path), eq(mocks.isActive, true)),
  });
}

export async function deleteMock(id: string, clerkUserId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const existing = await db.query.mocks.findFirst({
    where: and(eq(mocks.id, id), eq(mocks.userId, user.id)),
  });
  if (!existing) {
    throw new NotFoundError("Mock not found");
  }

  // Soft delete — keep the mock row so request_logs FK stays valid
  await db
    .update(mocks)
    .set({ isActive: false })
    .where(and(eq(mocks.id, id), eq(mocks.userId, user.id)));

  return true;
}
