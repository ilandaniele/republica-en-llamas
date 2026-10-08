import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Only public, non-user data is persisted to localStorage.
const PERSISTED_QUERY_ROOTS = new Set(['leaderboard']);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister: createSyncStoragePersister({ storage: window.localStorage, key: 'rel-query-cache' }),
  maxAge: ONE_DAY_MS,
  buster: import.meta.env.MODE,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      query.state.status === 'success' && PERSISTED_QUERY_ROOTS.has(String(query.queryKey[0])),
  },
};

export const PERSISTED_GC_TIME = ONE_DAY_MS;
