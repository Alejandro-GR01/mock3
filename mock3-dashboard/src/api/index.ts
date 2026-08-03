export const queryKeys = {
  mocks: {
    all: ["mocks"] as const,
    list: ["mocks", "list"] as const,
    detail: (id: string) => ["mocks", "detail", id] as const,
  },
  apiKeys: {
    all: ["apiKeys"] as const,
    list: ["apiKeys", "list"] as const,
  },
  usage: {
    all: ["usage"] as const,
    stats: ["usage", "stats"] as const,
    current: ["usage", "current"] as const,
    mockRanking: ["usage", "mockRanking"] as const,
  },
  user: {
    all: ["user"] as const,
    me: ["user", "me"] as const,
  },
} as const;
