import { api } from '../lib/api';
import { User } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/signin', { email, password });
    return data;
  },
  async signUp(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/signup', { name, email, password });
    return data;
  },
  async me(): Promise<{ user: User }> {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data;
  },
};
