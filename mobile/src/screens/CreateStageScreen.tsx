import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { StageFormValues, stageSchema } from '../schemas/work';
import { useCreateStage } from '../hooks/useStages';
import { theme } from '../theme';
import { WorksStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<WorksStackParamList, 'CreateStage'>;
type Rt = RouteProp<WorksStackParamList, 'CreateStage'>;

export function CreateStageScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const createStage = useCreateStage(params.workId);

  const { control, handleSubmit } = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: { name: '', description: '' },
  });

  async function onSubmit(values: StageFormValues) {
    try {
      await createStage.mutateAsync(values);
      navigation.goBack();
    } catch {
      // shown below
    }
  }

  return (
    <Screen>
      <Header title="Nova etapa" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormField
          control={control}
          name="name"
          label="Nome da etapa"
          placeholder="Ex: Fundação, Acabamento..."
        />
        <FormField
          control={control}
          name="description"
          label="Descrição"
          placeholder="Detalhes opcionais"
          multiline
          numberOfLines={4}
          style={{ minHeight: 90, textAlignVertical: 'top' }}
        />

        {createStage.isError && (
          <Text style={styles.error}>{(createStage.error as Error).message}</Text>
        )}

        <Button
          title="Criar etapa"
          onPress={handleSubmit(onSubmit)}
          loading={createStage.isPending}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
});
