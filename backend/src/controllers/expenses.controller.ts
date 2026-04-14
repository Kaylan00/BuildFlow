import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { readDB, updateDB } from '../db';

interface AuthedRequest extends Request {
  userId?: string;
}

function ensureOwnership(workId: string, userId?: string): boolean {
  const db = readDB();
  return db.works.some((w) => w.id === workId && w.userId === userId);
}

export function listExpenses(req: AuthedRequest, res: Response) {
  const { workId } = req.params;
  if (!ensureOwnership(workId, req.userId)) {
    return res.status(404).json({ message: 'Work not found' });
  }
  const db = readDB();
  const expenses = db.expenses
    .filter((e) => e.workId === workId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return res.json(expenses);
}

export function createExpense(req: AuthedRequest, res: Response) {
  const { workId } = req.params;
  if (!ensureOwnership(workId, req.userId)) {
    return res.status(404).json({ message: 'Work not found' });
  }
  const { description, amount, category = 'general', date } = req.body ?? {};
  if (!description) return res.status(400).json({ message: 'description is required' });
  if (amount === undefined || isNaN(Number(amount))) {
    return res.status(400).json({ message: 'amount is required' });
  }

  const expense = {
    id: uuid(),
    workId,
    description,
    amount: Number(amount),
    category,
    date: date ?? new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  updateDB((d) => {
    d.expenses.push(expense);
  });
  return res.status(201).json(expense);
}

export function deleteExpense(req: AuthedRequest, res: Response) {
  const db = readDB();
  const expense = db.expenses.find((e) => e.id === req.params.expenseId);
  if (!expense || !ensureOwnership(expense.workId, req.userId)) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  updateDB((d) => {
    d.expenses = d.expenses.filter((e) => e.id !== expense.id);
  });
  return res.status(204).send();
}

export function expensesSummary(req: AuthedRequest, res: Response) {
  const { workId } = req.params;
  if (!ensureOwnership(workId, req.userId)) {
    return res.status(404).json({ message: 'Work not found' });
  }
  const db = readDB();
  const work = db.works.find((w) => w.id === workId)!;
  const expenses = db.expenses.filter((e) => e.workId === workId);
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  return res.json({
    budget: work.budget,
    totalSpent,
    remaining: work.budget - totalSpent,
    byCategory,
    count: expenses.length,
  });
}
