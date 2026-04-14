import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import { ExpensePayload, expensesService } from '../services/expenses.service';

export function useExpenses(workId: string) {
  return useQuery({
    queryKey: queryKeys.expenses(workId),
    queryFn: () => expensesService.list(workId),
    enabled: Boolean(workId),
  });
}

export function useExpensesSummary(workId: string) {
  return useQuery({
    queryKey: queryKeys.expensesSummary(workId),
    queryFn: () => expensesService.summary(workId),
    enabled: Boolean(workId),
  });
}

export function useCreateExpense(workId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExpensePayload) => expensesService.create(workId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.expenses(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.expensesSummary(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.work(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteExpense(workId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) => expensesService.remove(expenseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.expenses(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.expensesSummary(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.work(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
