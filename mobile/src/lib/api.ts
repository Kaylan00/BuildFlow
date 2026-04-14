import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { STORAGE_KEYS, storage } from './storage';

/**
 * Resolve the API base URL.
 * - Uses `extra.apiUrl` from app.json as the default
 * - On Android emulator, localhost must be swapped for 10.0.2.2
 */
function resolveBaseURL(): string {
  const fromExtra =
    (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
    'http://localhost:3333/api';

  if (Platform.OS === 'android' && fromExtra.includes('localhost')) {
    return fromExtra.replace('localhost', '10.0.2.2');
  }
  return fromExtra;
}

export const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await storage.get<string>(STORAGE_KEYS.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Unexpected error. Please try again.';
    return Promise.reject(new Error(message));
  },
);
