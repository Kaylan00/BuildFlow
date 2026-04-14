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
import { ExpenseFormValues, expenseSchema } from '../schemas/work';
import { useCreateExpense } from '../hooks/useExpenses';
import { theme } from '../theme';
import { WorksStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<WorksStackParamList, 'CreateExpense'>;
type Rt = RouteProp<WorksStackParamList, 'CreateExpense'>;

export function CreateExpenseScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const createExpense = useCreateExpense(params.workId);

  const { control, handleSubmit } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { description: '', amount: 0, category: 'Geral' },
  });

  async function onSubmit(values: ExpenseFormValues) {
    try {
      await createExpense.mutateAsync(values);
      navigation.goBack();
    } catch {
      // shown below
    }
  }

  return (
    <Screen>
      <Header title="Novo lançamento" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormField
          control={control}
          name="description"
          label="Descrição"
          placeholder="Ex: Compra de cimento"
        />
        <FormField
          control={control}
          name="amount"
          label="Valor (R$)"
          keyboardType="numeric"
          placeholder="0,00"
        />
        <FormField
          control={control}
          name="category"
          label="Categoria"
          placeholder="Material, Mão de obra, Equipamento..."
        />

        {createExpense.isError && (
          <Text style={styles.error}>{(createExpense.error as Error).message}</Text>
        )}

        <Button
          title="Registrar"
          onPress={handleSubmit(onSubmit)}
          loading={createExpense.isPending}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
});
