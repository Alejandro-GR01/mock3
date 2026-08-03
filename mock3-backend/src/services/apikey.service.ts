import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { apiKeys, users } from "../db/schema.js";
import { sha256Hash } from "../utils/crypto.js";

const KEY_PREFIX_LENGTH = 8;

export type ApiKeyWithKey = {
  id: string;
  keyPrefix: string;
  name: string;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  key: string;
};

function generateFullKey(): string {
  const raw = randomUUID().replace(/-/g, "");
  return `m3_live_${raw}`;
}

function derivePrefix(fullKey: string): string {
  return fullKey.slice(0, KEY_PREFIX_LENGTH);
}

async function resolveUserId(clerkUserId: string): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user.id;
}

export async function generateApiKey(clerkUserId: string, name = "", expiresInHours?: number) {
  const userId = await resolveUserId(clerkUserId);
  const fullKey = generateFullKey();
  const keyHash = sha256Hash(fullKey);
  const keyPrefix = derivePrefix(fullKey);

  const expiresAt = expiresInHours !== undefined ? new Date(Date.now() + expiresInHours * 3600 * 1000) : null;

  const [created] = await db
    .insert(apiKeys)
    .values({
      userId,
      keyHash,
      keyPrefix,
      name,
      isActive: true,
      expiresAt,
    })
    .returning({
      id: apiKeys.id,
      keyPrefix: apiKeys.keyPrefix,
      name: apiKeys.name,
      isActive: apiKeys.isActive,
      expiresAt: apiKeys.expiresAt,
      createdAt: apiKeys.createdAt,
    });

  return { ...created, key: fullKey };
}

export async function getApiKeysByUserId(clerkUserId: string) {
  const userId = await resolveUserId(clerkUserId);

  return db
    .select({
      id: apiKeys.id,
      keyPrefix: apiKeys.keyPrefix,
      name: apiKeys.name,
      isActive: apiKeys.isActive,
      expiresAt: apiKeys.expiresAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)));
}

export async function regenerateApiKey(id: string, clerkUserId: string): Promise<ApiKeyWithKey | null | { error: "KEY_EXPIRED" }> {
  const userId = await resolveUserId(clerkUserId);

  const [existing] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)));

  if (!existing) return null;

  if (existing.expiresAt !== null && existing.expiresAt <= new Date()) {
    return { error: "KEY_EXPIRED" } as const;
  }

  const fullKey = generateFullKey();
  const keyHash = sha256Hash(fullKey);
  const keyPrefix = derivePrefix(fullKey);

  await db
    .update(apiKeys)
    .set({ keyHash, keyPrefix })
    .where(eq(apiKeys.id, id));

  const [updated] = await db
    .select({
      id: apiKeys.id,
      keyPrefix: apiKeys.keyPrefix,
      name: apiKeys.name,
      isActive: apiKeys.isActive,
      expiresAt: apiKeys.expiresAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.id, id));

  return { ...updated, key: fullKey };
}

export async function deleteApiKey(id: string, clerkUserId: string): Promise<boolean> {
  const userId = await resolveUserId(clerkUserId);

  const [existing] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));

  if (!existing) {
    const [keyOnly] = await db
      .select({ userId: apiKeys.userId })
      .from(apiKeys)
      .where(eq(apiKeys.id, id));

    if (keyOnly) {
      console.warn(`[DELETE KEY] Key ${id} exists but belongs to user ${keyOnly.userId}, not ${userId}`);
    } else {
      console.warn(`[DELETE KEY] Key ${id} not found in database at all`);
    }

    return false;
  }

  await db
    .update(apiKeys)
    .set({ isActive: false })
    .where(eq(apiKeys.id, id));

  return true;
}

export async function findApiKeyByHash(keyHash: string) {
  const result = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.keyHash, keyHash), eq(apiKeys.isActive, true)),
  });

  if (!result) return null;

  if (result.expiresAt !== null && result.expiresAt <= new Date()) {
    return null;
  }

  return result;
}
