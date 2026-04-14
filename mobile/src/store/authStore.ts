import { create } from 'zustand';
import { STORAGE_KEYS, storage } from '../lib/storage';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrate: () => Promise<void>;
  signInLocal: (data: { user: User; token: string }) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  async hydrate() {
    const [token, user] = await Promise.all([
      storage.get<string>(STORAGE_KEYS.token),
      storage.get<User>(STORAGE_KEYS.user),
    ]);
    set({
      token: token ?? null,
      user: user ?? null,
      isAuthenticated: Boolean(token && user),
    });
  },

  async signInLocal({ user, token }) {
    await Promise.all([
      storage.set(STORAGE_KEYS.token, token),
      storage.set(STORAGE_KEYS.user, user),
    ]);
    set({ user, token, isAuthenticated: true });
  },

  async signOut() {
    await Promise.all([
      storage.remove(STORAGE_KEYS.token),
      storage.remove(STORAGE_KEYS.user),
    ]);
    set({ user: null, token: null, isAuthenticated: false });
  },

  async setUser(user) {
    await storage.set(STORAGE_KEYS.user, user);
    set({ user });
  },
}));
