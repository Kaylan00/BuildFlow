export type WorkStatus = 'planning' | 'in_progress' | 'paused' | 'completed';
export type RiskLevel = 'low' | 'medium' | 'high';
export type StageStatus = 'pending' | 'in_progress' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Work {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: WorkStatus;
  progress: number; // 0 - 100
  risk: RiskLevel;
  budget: number;
  startDate: string;
  endDate?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  stageId: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface Stage {
  id: string;
  workId: string;
  name: string;
  description?: string;
  status: StageStatus;
  progress: number;
  order: number;
  createdAt: string;
  tasks: Task[];
}

export interface Expense {
  id: string;
  workId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export interface AuthRequest extends Express.Request {
  userId?: string;
}
