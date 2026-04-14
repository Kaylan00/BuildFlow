import { api } from '../lib/api';
import { Stage, Task } from '../types';

export const stagesService = {
  async list(workId: string): Promise<Stage[]> {
    const { data } = await api.get<Stage[]>(`/works/${workId}/stages`);
    return data;
  },
  async create(workId: string, payload: { name: string; description?: string }): Promise<Stage> {
    const { data } = await api.post<Stage>(`/works/${workId}/stages`, payload);
    return data;
  },
  async update(stageId: string, payload: Partial<Stage>): Promise<Stage> {
    const { data } = await api.put<Stage>(`/stages/${stageId}`, payload);
    return data;
  },
  async remove(stageId: string): Promise<void> {
    await api.delete(`/stages/${stageId}`);
  },
  async addTask(stageId: string, title: string): Promise<Task> {
    const { data } = await api.post<Task>(`/stages/${stageId}/tasks`, { title });
    return data;
  },
  async toggleTask(stageId: string, taskId: string): Promise<Stage> {
    const { data } = await api.patch<Stage>(`/stages/${stageId}/tasks/${taskId}`);
    return data;
  },
  async removeTask(stageId: string, taskId: string): Promise<void> {
    await api.delete(`/stages/${stageId}/tasks/${taskId}`);
  },
};
