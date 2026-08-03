import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import { queryKeys } from "@/api";
import { useAuthStore } from "@/stores/auth.store";
import type { ApiKey } from "@/types";

export interface ApiKeyWithKey extends ApiKey {
  key: string;
}

interface ApiResponse<T> {
  data: T;
}

export function useApiKeys() {
  const isAuthReady = useAuthStore((s) => s.isReady);

  return useQuery({
    queryKey: queryKeys.apiKeys.list,
    queryFn: async () => {
      const { data } = await http.get<ApiResponse<ApiKey[]>>("/api/api-keys");
      return data.data;
    },
    select: (keys) =>
      [...keys].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    enabled: isAuthReady,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data?: { name?: string; expiresInHours?: number }
    ) => {
      const body: { name?: string; expiresInHours?: number } = {};
      if (data?.name) body.name = data.name;
      if (data?.expiresInHours !== undefined)
        body.expiresInHours = data.expiresInHours;
      const { data: response } = await http.post<ApiResponse<ApiKeyWithKey>>(
        "/api/api-keys",
        body
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all });
    },
  });
}

export function useRegenerateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.post<ApiResponse<ApiKeyWithKey>>(
        `/api/api-keys/${id}/regenerate`
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/api/api-keys/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.apiKeys.list });

      const previous = queryClient.getQueryData<ApiKey[]>(queryKeys.apiKeys.list);

      queryClient.setQueryData<ApiKey[]>(queryKeys.apiKeys.list, (old) =>
        (old || []).filter((key) => key.id !== id)
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.apiKeys.list, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all });
    },
  });
}
