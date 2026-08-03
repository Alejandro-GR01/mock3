export interface User {
  id: string;
  clerkUserId: string;
  email: string | null;
  plan: "free" | "pro";
  maxSlots: number;
  createdAt: string;
}

export interface UserProfile {
  email: string | null;
  plan: "free" | "pro";
  maxSlots: number;
}

export interface MockMethodConfig {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface Mock {
  id: string;
  userId: string;
  slug: string;
  name: string | null;
  path: string;
  methods: Record<string, MockMethodConfig>;
  isActive: boolean;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  keyPrefix: string;
  name: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface MockSlots {
  used: number;
  max: number;
}

export interface UsageStats {
  today: number;
  remaining: number;
  totalMocks: number;
  hourlyData: number[];
  mockSlots: MockSlots;
}

export interface CurrentUsage {
  count: number;
  limit: number;
  remaining: number;
  resetAt: string;
}

export interface MockUsageRanking {
  mockId: string;
  name: string | null;
  slug: string;
  path: string;
  isActive: boolean;
  method: string;
  requestCount: number;
}
