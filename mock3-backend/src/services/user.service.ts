import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "../utils/errors.js";

export async function findUserByClerkId(clerkUserId: string) {
  return db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
}

export async function syncUser(clerkUserId: string, email?: string) {
  const existing = await findUserByClerkId(clerkUserId);
  if (existing) return existing;

  const [newUser] = await db
    .insert(users)
    .values({
      clerkUserId,
      email: email ?? null,
      plan: "free",
      maxSlots: 3,
    })
    .returning();

  return newUser;
}

export async function getMe(clerkUserId: string) {
  const user = await findUserByClerkId(clerkUserId);
  if (!user) {
    // Clerk-authenticated users are synced on first login; treat as not found
    return null;
  }

  return {
    email: user.email ?? null,
    plan: user.plan,
    maxSlots: user.maxSlots,
  };
}

export async function deleteUser(clerkUserId: string) {
  const user = await findUserByClerkId(clerkUserId);
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  await db.delete(users).where(eq(users.id, user.id));

  // Delete the Clerk account. This MUST NOT fail the request: local data is
  // already gone (GDPR OK). Log and swallow errors — worst case Clerk keeps a
  // dead account that can re-sync empty.
  try {
    await clerkClient.users.deleteUser(clerkUserId);
  } catch (err) {
    console.error("[deleteUser] Clerk delete failed (local data already removed):", err);
  }
}
