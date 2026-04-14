import { Router } from 'express';
import { signIn, signUp, me } from '../controllers/auth.controller';
import {
  createWork,
  dashboard,
  deleteWork,
  getWork,
  listWorks,
  updateWork,
} from '../controllers/works.controller';
import {
  addTask,
  createStage,
  deleteStage,
  deleteTask,
  listStages,
  toggleTask,
  updateStage,
} from '../controllers/stages.controller';
import {
  createExpense,
  deleteExpense,
  expensesSummary,
  listExpenses,
} from '../controllers/expenses.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Auth
router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);
router.get('/auth/me', authMiddleware, me);

// Dashboard
router.get('/dashboard', authMiddleware, dashboard);

// Works
router.get('/works', authMiddleware, listWorks);
router.post('/works', authMiddleware, createWork);
router.get('/works/:id', authMiddleware, getWork);
router.put('/works/:id', authMiddleware, updateWork);
router.delete('/works/:id', authMiddleware, deleteWork);

// Stages (nested)
router.get('/works/:workId/stages', authMiddleware, listStages);
router.post('/works/:workId/stages', authMiddleware, createStage);
router.put('/stages/:stageId', authMiddleware, updateStage);
router.delete('/stages/:stageId', authMiddleware, deleteStage);

// Tasks
router.post('/stages/:stageId/tasks', authMiddleware, addTask);
router.patch('/stages/:stageId/tasks/:taskId', authMiddleware, toggleTask);
router.delete('/stages/:stageId/tasks/:taskId', authMiddleware, deleteTask);

// Expenses (nested)
router.get('/works/:workId/expenses', authMiddleware, listExpenses);
router.post('/works/:workId/expenses', authMiddleware, createExpense);
router.get('/works/:workId/expenses/summary', authMiddleware, expensesSummary);
router.delete('/expenses/:expenseId', authMiddleware, deleteExpense);

export default router;
