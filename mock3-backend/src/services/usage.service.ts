import { eq, and, sql, desc, count, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import { mocks, requestLogs, users } from "../db/schema.js";
import { AppError } from "../utils/errors.js";

async function resolveUserId(clerkUserId: string): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
    columns: { id: true },
  });
  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }
  return user.id;
}

export async function getUsageStats(clerkUserId: string) {
  const userId = await resolveUserId(clerkUserId);

  const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [todayResult] = await db
    .select({ count: count().mapWith(Number) })
    .from(requestLogs)
    .where(
      and(
        eq(requestLogs.userId, userId),
        gt(requestLogs.timestamp, cutoff24h)
      )
    );

  const cutoff1h = new Date(Date.now() - 60 * 60 * 1000);
  const [hourResult] = await db
    .select({ count: count().mapWith(Number) })
    .from(requestLogs)
    .where(
      and(
        eq(requestLogs.userId, userId),
        gt(requestLogs.timestamp, cutoff1h)
      )
    );

  const [mockCountResult] = await db
    .select({ count: count().mapWith(Number) })
    .from(mocks)
    .where(and(eq(mocks.userId, userId), eq(mocks.isActive, true)));

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { maxSlots: true },
  });

  const totalMocks = mockCountResult?.count ?? 0;
  const maxSlots = user?.maxSlots ?? 3;
  const currentHourCount = hourResult?.count ?? 0;
  const hourlyData = await getHourlyUsage(clerkUserId);

  return {
    today: todayResult?.count ?? 0,
    remaining: Math.max(0, 300 - currentHourCount),
    totalMocks,
    hourlyData,
    mockSlots: { used: totalMocks, max: maxSlots },
  };
}

async function getHourlyUsage(clerkUserId: string): Promise<number[]> {
  const userId = await resolveUserId(clerkUserId);

  const rows = await db
    .select({
      hour: sql<number>`EXTRACT(HOUR FROM ${requestLogs.timestamp})`.as("hour"),
      count: count().mapWith(Number).as("count"),
    })
    .from(requestLogs)
    .where(
      and(
        eq(requestLogs.userId, userId),
        gt(requestLogs.timestamp, new Date(Date.now() - 24 * 60 * 60 * 1000))
      )
    )
    .groupBy(sql`hour`)
    .orderBy(sql`hour`);

  const hourlyMap = new Map<number, number>();
  for (const row of rows) {
    hourlyMap.set(Number(row.hour), row.count);
  }

  const hourlyData: number[] = [];
  for (let i = 0; i < 24; i++) {
    hourlyData.push(hourlyMap.get(i) ?? 0);
  }

  return hourlyData;
}

export async function getCurrentUsage(clerkUserId: string) {
  const userId = await resolveUserId(clerkUserId);

  const [result] = await db
    .select({ count: count().mapWith(Number) })
    .from(requestLogs)
    .where(
      and(
        eq(requestLogs.userId, userId),
        gt(requestLogs.timestamp, new Date(Date.now() - 60 * 60 * 1000))
      )
    );

  const currentCount = result?.count ?? 0;
  const limit = 300;

  const now = new Date();
  const resetAt = new Date(now);
  resetAt.setHours(resetAt.getHours() + 1, 0, 0, 0);

  return {
    count: currentCount,
    limit,
    remaining: Math.max(0, limit - currentCount),
    resetAt: resetAt.toISOString(),
  };
}

export async function getMockUsageRanking(clerkUserId: string) {
  const userId = await resolveUserId(clerkUserId);

  const result = await db
    .select({
      mockId: requestLogs.mockId,
      name: mocks.name,
      slug: mocks.slug,
      path: mocks.path,
      isActive: mocks.isActive,
      method: requestLogs.method,
      requestCount: count().mapWith(Number),
    })
    .from(requestLogs)
    .innerJoin(mocks, eq(requestLogs.mockId, mocks.id))
    .where(eq(requestLogs.userId, userId))
    .groupBy(requestLogs.mockId, mocks.name, mocks.slug, mocks.path, mocks.isActive, requestLogs.method)
    .orderBy(desc(count()))
    .limit(10);

  return result;
}
