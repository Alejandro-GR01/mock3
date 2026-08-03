import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./index";
import http from "@/lib/http";
import { useAuthStore } from "@/stores/auth.store";
import type { Mock } from "@/types";

export function useMocks() {
  const isAuthReady = useAuthStore((s) => s.isReady);

  return useQuery({
    queryKey: queryKeys.mocks.list,
    queryFn: async () => {
      const { data } = await http.get<{ data: Mock[] }>("/api/mocks");
      return data.data;
    },
    select: (mocks) =>
      [...mocks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    enabled: isAuthReady,
  });
}

export function useMockDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.mocks.detail(id ?? ""),
    queryFn: async () => {
      const { data } = await http.get<{ data: Mock }>(`/api/mocks/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateMock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMock: { name: string; path: string; methods: string[] }) => {
      const { data } = await http.post<{ data: Mock }>("/api/mocks", newMock);
      return data.data;
    },
    onMutate: async (newMock) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.mocks.list });

      const previous = queryClient.getQueryData<Mock[]>(queryKeys.mocks.list);

      const optimisticMock: Mock = {
        id: `temp-${Date.now()}`,
        userId: "",
        slug: newMock.path.replace(/^\//, "").replace(/[^a-zA-Z0-9]/g, "-"),
        name: newMock.name,
        path: newMock.path,
        methods: newMock.methods.reduce(
          (acc, method) => {
            acc[method] = { status: 200, headers: {}, body: "{}" };
            return acc;
          },
          {} as Record<string, { status: number; headers: Record<string, string>; body: string }>
        ),
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      try {
        const existing = previous || [];
        queryClient.setQueryData<Mock[]>(queryKeys.mocks.list, [optimisticMock, ...existing]);
      } catch (e) {
        console.warn("[useCreateMock] optimistic update failed, proceeding:", e);
      }

      return { previous };
    },
    onError: (_err, _newMock, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.mocks.list, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.mocks.all });
    },
  });
}

export function useUpdateMock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { name: string; path: string; methods: string[] };
    }) => {
      const { data } = await http.put<{ data: Mock }>(`/api/mocks/${id}`, updates);
      return data.data;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.mocks.list });

      const previous = queryClient.getQueryData<Mock[]>(queryKeys.mocks.list);

      queryClient.setQueryData<Mock[]>(queryKeys.mocks.list, (old) =>
        (old || []).map((mock) =>
          mock.id === id
            ? { ...mock, name: updates.name, path: updates.path }
            : mock
        )
      );

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.mocks.list, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.mocks.all });
    },
  });
}

export function useUpdateMockMethods() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      methods,
    }: {
      id: string;
      methods: Record<string, { status: number; headers: Record<string, string>; body: string }>;
    }) => {
      const { data } = await http.put<{ data: Mock }>(`/api/mocks/${id}`, { methods });
      return data.data;
    },
    onMutate: async ({ id, methods }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.mocks.list });
      await queryClient.cancelQueries({ queryKey: queryKeys.mocks.detail(id) });

      const previousList = queryClient.getQueryData<Mock[]>(queryKeys.mocks.list);
      const previousDetail = queryClient.getQueryData<Mock>(queryKeys.mocks.detail(id));

      queryClient.setQueryData<Mock[]>(queryKeys.mocks.list, (old) =>
        (old || []).map((mock) =>
          mock.id === id ? { ...mock, methods } : mock
        )
      );

      if (previousDetail) {
        queryClient.setQueryData<Mock>(queryKeys.mocks.detail(id), {
          ...previousDetail,
          methods,
        });
      }

      return { previousList, previousDetail };
    },
    onError: (_err, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(queryKeys.mocks.list, context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.mocks.detail(variables.id),
          context.previousDetail
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.mocks.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mocks.detail(variables.id),
      });
    },
  });
}

export function useDeleteMock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/api/mocks/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.mocks.list });

      const previous = queryClient.getQueryData<Mock[]>(queryKeys.mocks.list);

      queryClient.setQueryData<Mock[]>(queryKeys.mocks.list, (old) =>
        (old || []).filter((mock) => mock.id !== id)
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.mocks.list, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.mocks.all });
    },
  });
}
