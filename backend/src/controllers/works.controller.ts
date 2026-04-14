import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { readDB, updateDB } from '../db';
import { RiskLevel, WorkStatus } from '../types';

interface AuthedRequest extends Request {
  userId?: string;
}

const VALID_STATUS: WorkStatus[] = ['planning', 'in_progress', 'paused', 'completed'];
const VALID_RISK: RiskLevel[] = ['low', 'medium', 'high'];

export function listWorks(req: AuthedRequest, res: Response) {
  const db = readDB();
  const works = db.works
    .filter((w) => w.userId === req.userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return res.json(works);
}

export function getWork(req: AuthedRequest, res: Response) {
  const db = readDB();
  const work = db.works.find((w) => w.id === req.params.id && w.userId === req.userId);
  if (!work) return res.status(404).json({ message: 'Work not found' });
  const stages = db.stages
    .filter((s) => s.workId === work.id)
    .sort((a, b) => a.order - b.order);
  const expenses = db.expenses.filter((e) => e.workId === work.id);
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  return res.json({ ...work, stages, totalSpent });
}

export function createWork(req: AuthedRequest, res: Response) {
  const {
    name,
    description = '',
    status = 'planning',
    progress = 0,
    risk = 'low',
    budget = 0,
    startDate,
    endDate,
    coverImage,
  } = req.body ?? {};

  if (!name) return res.status(400).json({ message: 'name is required' });
  if (!VALID_STATUS.includes(status)) return res.status(400).json({ message: 'invalid status' });
  if (!VALID_RISK.includes(risk)) return res.status(400).json({ message: 'invalid risk' });

  const now = new Date().toISOString();
  const work = {
    id: uuid(),
    userId: req.userId!,
    name,
    description,
    status,
    progress: Math.max(0, Math.min(100, Number(progress) || 0)),
    risk,
    budget: Number(budget) || 0,
    startDate: startDate ?? now,
    endDate,
    coverImage,
    createdAt: now,
    updatedAt: now,
  };
  updateDB((d) => {
    d.works.push(work);
  });
  return res.status(201).json(work);
}

export function updateWork(req: AuthedRequest, res: Response) {
  const db = readDB();
  const existing = db.works.find((w) => w.id === req.params.id && w.userId === req.userId);
  if (!existing) return res.status(404).json({ message: 'Work not found' });

  const allowed = [
    'name',
    'description',
    'status',
    'progress',
    'risk',
    'budget',
    'startDate',
    'endDate',
    'coverImage',
  ] as const;
  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in (req.body ?? {})) patch[key] = (req.body as Record<string, unknown>)[key];
  }
  if (patch.status && !VALID_STATUS.includes(patch.status as WorkStatus)) {
    return res.status(400).json({ message: 'invalid status' });
  }
  if (patch.risk && !VALID_RISK.includes(patch.risk as RiskLevel)) {
    return res.status(400).json({ message: 'invalid risk' });
  }
  if (patch.progress !== undefined) {
    patch.progress = Math.max(0, Math.min(100, Number(patch.progress) || 0));
  }

  const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  updateDB((d) => {
    d.works = d.works.map((w) => (w.id === updated.id ? updated : w));
  });
  return res.json(updated);
}

export function deleteWork(req: AuthedRequest, res: Response) {
  const db = readDB();
  const work = db.works.find((w) => w.id === req.params.id && w.userId === req.userId);
  if (!work) return res.status(404).json({ message: 'Work not found' });
  updateDB((d) => {
    d.works = d.works.filter((w) => w.id !== work.id);
    d.stages = d.stages.filter((s) => s.workId !== work.id);
    d.expenses = d.expenses.filter((e) => e.workId !== work.id);
  });
  return res.status(204).send();
}

export function dashboard(req: AuthedRequest, res: Response) {
  const db = readDB();
  const works = db.works.filter((w) => w.userId === req.userId);
  const totalBudget = works.reduce((acc, w) => acc + w.budget, 0);
  const totalSpent = db.expenses
    .filter((e) => works.some((w) => w.id === e.workId))
    .reduce((acc, e) => acc + e.amount, 0);
  const avgProgress =
    works.length === 0 ? 0 : Math.round(works.reduce((acc, w) => acc + w.progress, 0) / works.length);

  const byStatus = works.reduce<Record<string, number>>((acc, w) => {
    acc[w.status] = (acc[w.status] ?? 0) + 1;
    return acc;
  }, {});
  const byRisk = works.reduce<Record<string, number>>((acc, w) => {
    acc[w.risk] = (acc[w.risk] ?? 0) + 1;
    return acc;
  }, {});

  return res.json({
    totalWorks: works.length,
    totalBudget,
    totalSpent,
    avgProgress,
    byStatus,
    byRisk,
    recentWorks: [...works]
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 3),
  });
}
