import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import { WorkPayload, worksService } from '../services/works.service';

export function useWorks() {
  return useQuery({
    queryKey: queryKeys.works,
    queryFn: worksService.list,
  });
}

export function useWork(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.work(id) : ['works', 'disabled'],
    queryFn: () => worksService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: worksService.dashboard,
  });
}

export function useCreateWork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WorkPayload) => worksService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.works });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateWork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: Partial<WorkPayload> }) =>
      worksService.update(vars.id, vars.payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.works });
      qc.invalidateQueries({ queryKey: queryKeys.work(vars.id) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteWork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => worksService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.works });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
