import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./index";
import http from "@/lib/http";
import { useAuthStore } from "@/stores/auth.store";
import type { UsageStats, CurrentUsage, MockUsageRanking } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export function useUsageStats() {
  const isAuthReady = useAuthStore((s) => s.isReady);

  return useQuery({
    queryKey: queryKeys.usage.stats,
    queryFn: async () => {
      const { data } =
        await http.get<ApiResponse<UsageStats>>("/api/usage");
      return data.data;
    },
    enabled: isAuthReady,
    refetchInterval: 30000,
  });
}

export function useCurrentUsage() {
  const isAuthReady = useAuthStore((s) => s.isReady);

  return useQuery({
    queryKey: queryKeys.usage.current,
    queryFn: async () => {
      const { data } =
        await http.get<ApiResponse<CurrentUsage>>("/api/usage/current");
      return data.data;
    },
    enabled: isAuthReady,
    refetchInterval: 30000,
  });
}

export function useMockUsageRanking() {
  const isAuthReady = useAuthStore((s) => s.isReady);

  return useQuery({
    queryKey: queryKeys.usage.mockRanking,
    queryFn: async () => {
      const { data } = await http.get<ApiResponse<MockUsageRanking[]>>(
        "/api/usage/mocks"
      );
      return data.data;
    },
    enabled: isAuthReady,
    refetchInterval: 30000,
  });
}
