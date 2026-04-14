import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  works: ['works'] as const,
  work: (id: string) => ['works', id] as const,
  stages: (workId: string) => ['works', workId, 'stages'] as const,
  expenses: (workId: string) => ['works', workId, 'expenses'] as const,
  expensesSummary: (workId: string) => ['works', workId, 'expenses', 'summary'] as const,
};
