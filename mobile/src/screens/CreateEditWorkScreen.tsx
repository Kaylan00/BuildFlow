import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Loading } from '../components/Loading';
import { WorkFormValues, workSchema } from '../schemas/work';
import { useCreateWork, useUpdateWork, useWork } from '../hooks/useWorks';
import { theme } from '../theme';
import { WorksStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<WorksStackParamList, 'CreateEditWork'>;
type Rt = RouteProp<WorksStackParamList, 'CreateEditWork'>;

const STATUS_OPTIONS = [
  { label: 'Planejamento', value: 'planning' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Pausada', value: 'paused' },
  { label: 'Concluída', value: 'completed' },
] as const;

const RISK_OPTIONS = [
  { label: 'Baixo', value: 'low' },
  { label: 'Médio', value: 'medium' },
  { label: 'Alto', value: 'high' },
] as const;

export function CreateEditWorkScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const workId = route.params?.workId;
  const isEdit = Boolean(workId);

  const { data: existing, isLoading } = useWork(workId);
  const createWork = useCreateWork();
  const updateWork = useUpdateWork();

  const { control, handleSubmit, reset } = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      risk: 'low',
      progress: 0,
      budget: 0,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        description: existing.description,
        status: existing.status,
        risk: existing.risk,
        progress: existing.progress,
        budget: existing.budget,
      });
    }
  }, [existing, reset]);

  async function onSubmit(values: WorkFormValues) {
    try {
      if (isEdit && workId) {
        await updateWork.mutateAsync({ id: workId, payload: values });
      } else {
        await createWork.mutateAsync(values);
      }
      navigation.goBack();
    } catch {
      // error visible via *.error
    }
  }

  if (isEdit && isLoading) return <Loading message="Carregando..." />;

  const isSubmitting = createWork.isPending || updateWork.isPending;
  const submitError = (createWork.error || updateWork.error) as Error | null;

  return (
    <Screen>
      <Header
        title={isEdit ? 'Editar obra' : 'Nova obra'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <FormField control={control} name="name" label="Nome" placeholder="Ex: Reforma casa praia" />
          <FormField
            control={control}
            name="description"
            label="Descrição"
            placeholder="Detalhes sobre a obra"
            multiline
            numberOfLines={4}
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />

          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Select
                label="Status"
                value={value}
                onChange={onChange}
                options={[...STATUS_OPTIONS]}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="risk"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Select
                label="Indicador de risco"
                value={value}
                onChange={onChange}
                options={[...RISK_OPTIONS]}
                error={error?.message}
              />
            )}
          />

          <FormField
            control={control}
            name="progress"
            label="Progresso (%)"
            keyboardType="numeric"
            placeholder="0"
          />
          <FormField
            control={control}
            name="budget"
            label="Orçamento (R$)"
            keyboardType="numeric"
            placeholder="0"
          />

          {submitError && <Text style={styles.error}>{submitError.message}</Text>}

          <Button
            title={isEdit ? 'Salvar alterações' : 'Criar obra'}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
});
