import { api } from '../lib/api';
import { DashboardData, Work, WorkDetails } from '../types';

export interface WorkPayload {
  name: string;
  description?: string;
  status: Work['status'];
  risk: Work['risk'];
  progress: number;
  budget: number;
  coverImage?: string;
}

export const worksService = {
  async list(): Promise<Work[]> {
    const { data } = await api.get<Work[]>('/works');
    return data;
  },
  async get(id: string): Promise<WorkDetails> {
    const { data } = await api.get<WorkDetails>(`/works/${id}`);
    return data;
  },
  async create(payload: WorkPayload): Promise<Work> {
    const { data } = await api.post<Work>('/works', payload);
    return data;
  },
  async update(id: string, payload: Partial<WorkPayload>): Promise<Work> {
    const { data } = await api.put<Work>(`/works/${id}`, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/works/${id}`);
  },
  async dashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>('/dashboard');
    return data;
  },
};
