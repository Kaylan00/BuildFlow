import { z } from 'zod';

export const workSchema = z.object({
  name: z.string().min(2, 'Informe o nome da obra'),
  description: z.string().optional().default(''),
  status: z.enum(['planning', 'in_progress', 'paused', 'completed']),
  risk: z.enum(['low', 'medium', 'high']),
  progress: z.coerce.number().min(0).max(100),
  budget: z.coerce.number().min(0, 'Orçamento inválido'),
});

export type WorkFormValues = z.infer<typeof workSchema>;

export const stageSchema = z.object({
  name: z.string().min(2, 'Informe o nome da etapa'),
  description: z.string().optional().default(''),
});

export type StageFormValues = z.infer<typeof stageSchema>;

export const expenseSchema = z.object({
  description: z.string().min(2, 'Informe a descrição'),
  amount: z.coerce.number().positive('Valor deve ser maior que zero'),
  category: z.string().min(1, 'Informe a categoria').default('Geral'),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
