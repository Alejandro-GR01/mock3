import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "./index";
import http from "@/lib/http";
import { useAuthStore } from "@/stores/auth.store";
import type { UserProfile } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export function useMe() {
  const isAuthReady = useAuthStore((s) => s.isReady);

  return useQuery({
    queryKey: queryKeys.user.me,
    queryFn: async () => {
      const { data } =
        await http.get<ApiResponse<UserProfile>>("/api/me");
      return data.data;
    },
    enabled: isAuthReady,
    refetchInterval: 30000,
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      await http.delete("/api/me");
    },
  });
}
