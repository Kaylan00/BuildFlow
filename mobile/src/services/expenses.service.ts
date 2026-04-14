import { api } from '../lib/api';
import { Expense, ExpensesSummary } from '../types';

export interface ExpensePayload {
  description: string;
  amount: number;
  category: string;
  date?: string;
}

export const expensesService = {
  async list(workId: string): Promise<Expense[]> {
    const { data } = await api.get<Expense[]>(`/works/${workId}/expenses`);
    return data;
  },
  async create(workId: string, payload: ExpensePayload): Promise<Expense> {
    const { data } = await api.post<Expense>(`/works/${workId}/expenses`, payload);
    return data;
  },
  async remove(expenseId: string): Promise<void> {
    await api.delete(`/expenses/${expenseId}`);
  },
  async summary(workId: string): Promise<ExpensesSummary> {
    const { data } = await api.get<ExpensesSummary>(`/works/${workId}/expenses/summary`);
    return data;
  },
};
