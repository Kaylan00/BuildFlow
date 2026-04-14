import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

export function useSignIn() {
  const signInLocal = useAuthStore((s) => s.signInLocal);
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      return authService.signIn(vars.email, vars.password);
    },
    onSuccess: async (data) => {
      await signInLocal(data);
    },
  });
}

export function useSignUp() {
  const signInLocal = useAuthStore((s) => s.signInLocal);
  return useMutation({
    mutationFn: async (vars: { name: string; email: string; password: string }) => {
      return authService.signUp(vars.name, vars.email, vars.password);
    },
    onSuccess: async (data) => {
      await signInLocal(data);
    },
  });
}
