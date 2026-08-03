import { index, jsonb, pgEnum, pgTable, timestamp, uuid, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "pro"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }),
  plan: planEnum("plan").default("free").notNull(),
  maxSlots: integer("max_slots").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mocks = pgTable(
  "mocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 255 }),
    path: varchar("path", { length: 255 }).notNull(),
    methods: jsonb("methods").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    idxMocksUserId: index("idx_mocks_user_id").on(table.userId),
  }),
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    keyHash: varchar("key_hash", { length: 255 }).notNull(),
    keyPrefix: varchar("key_prefix", { length: 10 }).notNull(),
    name: varchar("name", { length: 255 }).notNull().default(""),
    isActive: boolean("is_active").default(true).notNull(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    idxApiKeysUserId: index("idx_api_keys_user_id").on(table.userId),
  }),
);

export const requestLogs = pgTable(
  "request_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    mockId: uuid("mock_id")
      .references(() => mocks.id, { onDelete: "cascade" })
      .notNull(),
    method: varchar("method", { length: 10 }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 500 }),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => ({
    idxRequestLogsUserTime: index("idx_request_logs_user_time").on(
      table.userId,
      table.timestamp,
    ),
  }),
);
