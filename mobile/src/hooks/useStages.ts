import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import { stagesService } from '../services/stages.service';

export function useStages(workId: string) {
  return useQuery({
    queryKey: queryKeys.stages(workId),
    queryFn: () => stagesService.list(workId),
    enabled: Boolean(workId),
  });
}

export function useCreateStage(workId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      stagesService.create(workId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stages(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.work(workId) });
    },
  });
}

export function useDeleteStage(workId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stageId: string) => stagesService.remove(stageId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stages(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.work(workId) });
    },
  });
}

export function useAddTask(workId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { stageId: string; title: string }) =>
      stagesService.addTask(vars.stageId, vars.title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stages(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.work(workId) });
    },
  });
}

export function useToggleTask(workId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { stageId: string; taskId: string }) =>
      stagesService.toggleTask(vars.stageId, vars.taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stages(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.work(workId) });
    },
  });
}

export function useRemoveTask(workId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { stageId: string; taskId: string }) =>
      stagesService.removeTask(vars.stageId, vars.taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stages(workId) });
      qc.invalidateQueries({ queryKey: queryKeys.work(workId) });
    },
  });
}
