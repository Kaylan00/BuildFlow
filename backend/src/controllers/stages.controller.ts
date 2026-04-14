import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { readDB, updateDB } from '../db';
import { StageStatus } from '../types';

interface AuthedRequest extends Request {
  userId?: string;
}

const VALID_STATUS: StageStatus[] = ['pending', 'in_progress', 'completed'];

function ensureOwnership(workId: string, userId?: string): boolean {
  const db = readDB();
  return db.works.some((w) => w.id === workId && w.userId === userId);
}

export function listStages(req: AuthedRequest, res: Response) {
  const { workId } = req.params;
  if (!ensureOwnership(workId, req.userId)) {
    return res.status(404).json({ message: 'Work not found' });
  }
  const db = readDB();
  const stages = db.stages
    .filter((s) => s.workId === workId)
    .sort((a, b) => a.order - b.order);
  return res.json(stages);
}

export function createStage(req: AuthedRequest, res: Response) {
  const { workId } = req.params;
  if (!ensureOwnership(workId, req.userId)) {
    return res.status(404).json({ message: 'Work not found' });
  }
  const { name, description = '', status = 'pending' } = req.body ?? {};
  if (!name) return res.status(400).json({ message: 'name is required' });
  if (!VALID_STATUS.includes(status)) return res.status(400).json({ message: 'invalid status' });

  const db = readDB();
  const order = db.stages.filter((s) => s.workId === workId).length;
  const stage = {
    id: uuid(),
    workId,
    name,
    description,
    status: status as StageStatus,
    progress: status === 'completed' ? 100 : 0,
    order,
    createdAt: new Date().toISOString(),
    tasks: [],
  };
  updateDB((d) => {
    d.stages.push(stage);
  });
  return res.status(201).json(stage);
}

export function updateStage(req: AuthedRequest, res: Response) {
  const db = readDB();
  const stage = db.stages.find((s) => s.id === req.params.stageId);
  if (!stage || !ensureOwnership(stage.workId, req.userId)) {
    return res.status(404).json({ message: 'Stage not found' });
  }
  const patch = req.body ?? {};
  if (patch.status && !VALID_STATUS.includes(patch.status)) {
    return res.status(400).json({ message: 'invalid status' });
  }
  if (patch.progress !== undefined) {
    patch.progress = Math.max(0, Math.min(100, Number(patch.progress) || 0));
  }
  const updated = { ...stage, ...patch };
  updateDB((d) => {
    d.stages = d.stages.map((s) => (s.id === updated.id ? updated : s));
  });
  return res.json(updated);
}

export function deleteStage(req: AuthedRequest, res: Response) {
  const db = readDB();
  const stage = db.stages.find((s) => s.id === req.params.stageId);
  if (!stage || !ensureOwnership(stage.workId, req.userId)) {
    return res.status(404).json({ message: 'Stage not found' });
  }
  updateDB((d) => {
    d.stages = d.stages.filter((s) => s.id !== stage.id);
  });
  return res.status(204).send();
}

export function addTask(req: AuthedRequest, res: Response) {
  const db = readDB();
  const stage = db.stages.find((s) => s.id === req.params.stageId);
  if (!stage || !ensureOwnership(stage.workId, req.userId)) {
    return res.status(404).json({ message: 'Stage not found' });
  }
  const { title } = req.body ?? {};
  if (!title) return res.status(400).json({ message: 'title is required' });

  const task = {
    id: uuid(),
    stageId: stage.id,
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  updateDB((d) => {
    const s = d.stages.find((x) => x.id === stage.id);
    if (s) s.tasks.push(task);
  });
  return res.status(201).json(task);
}

export function toggleTask(req: AuthedRequest, res: Response) {
  const db = readDB();
  const stage = db.stages.find((s) => s.id === req.params.stageId);
  if (!stage || !ensureOwnership(stage.workId, req.userId)) {
    return res.status(404).json({ message: 'Stage not found' });
  }
  const task = stage.tasks.find((t) => t.id === req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  updateDB((d) => {
    const s = d.stages.find((x) => x.id === stage.id);
    if (!s) return;
    s.tasks = s.tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t));
    const total = s.tasks.length;
    const done = s.tasks.filter((t) => t.done).length;
    s.progress = total === 0 ? s.progress : Math.round((done / total) * 100);
    if (s.progress === 100) s.status = 'completed';
    else if (s.progress > 0) s.status = 'in_progress';
    else s.status = 'pending';
  });
  const fresh = readDB().stages.find((x) => x.id === stage.id);
  return res.json(fresh);
}

export function deleteTask(req: AuthedRequest, res: Response) {
  const db = readDB();
  const stage = db.stages.find((s) => s.id === req.params.stageId);
  if (!stage || !ensureOwnership(stage.workId, req.userId)) {
    return res.status(404).json({ message: 'Stage not found' });
  }
  updateDB((d) => {
    const s = d.stages.find((x) => x.id === stage.id);
    if (!s) return;
    s.tasks = s.tasks.filter((t) => t.id !== req.params.taskId);
  });
  return res.status(204).send();
}
