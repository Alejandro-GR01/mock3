import { QueryCache, QueryClient } from "@tanstack/react-query";
import { useConnectionStore } from "@/stores/connection.store";

const queryCache = new QueryCache({
  onError: () => {
    useConnectionStore.getState().setOffline(true);
  },
  onSuccess: () => {
    useConnectionStore.getState().setOffline(false);
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache,
});
