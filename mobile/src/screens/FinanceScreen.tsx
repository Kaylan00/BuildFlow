import React from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import {
  useDeleteExpense,
  useExpenses,
  useExpensesSummary,
} from '../hooks/useExpenses';
import { theme } from '../theme';
import { formatCurrency, formatDate } from '../utils/format';
import { WorksStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<WorksStackParamList, 'Finance'>;
type Rt = RouteProp<WorksStackParamList, 'Finance'>;

export function FinanceScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { workId } = params;

  const summaryQ = useExpensesSummary(workId);
  const expensesQ = useExpenses(workId);
  const deleteExpense = useDeleteExpense(workId);

  if (summaryQ.isLoading || expensesQ.isLoading) return <Loading message="Carregando..." />;

  const summary = summaryQ.data;
  const expenses = expensesQ.data ?? [];

  const spentPct =
    summary && summary.budget > 0
      ? Math.min(100, Math.round((summary.totalSpent / summary.budget) * 100))
      : 0;

  return (
    <Screen>
      <Header
        title="Financeiro"
        onBack={() => navigation.goBack()}
        rightAction={
          <Pressable
            onPress={() => navigation.navigate('CreateExpense', { workId })}
            hitSlop={10}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        }
      />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
        refreshControl={
          <RefreshControl
            refreshing={summaryQ.isRefetching || expensesQ.isRefetching}
            onRefresh={() => {
              summaryQ.refetch();
              expensesQ.refetch();
            }}
            tintColor={theme.colors.primary}
          />
        }
        ListHeaderComponent={
          summary ? (
            <View style={{ gap: theme.spacing.md }}>
              <Card>
                <Text style={styles.sectionTitle}>Previsto vs Realizado</Text>
                <ProgressBar
                  value={spentPct}
                  color={
                    summary.totalSpent > summary.budget ? theme.colors.danger : theme.colors.success
                  }
                />
                <View style={styles.row}>
                  <Text style={styles.label}>Orçamento</Text>
                  <Text style={styles.value}>{formatCurrency(summary.budget)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Gasto</Text>
                  <Text style={styles.value}>{formatCurrency(summary.totalSpent)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Saldo</Text>
                  <Text
                    style={[
                      styles.value,
                      { color: summary.remaining >= 0 ? theme.colors.success : theme.colors.danger },
                    ]}
                  >
                    {formatCurrency(summary.remaining)}
                  </Text>
                </View>
              </Card>

              {Object.keys(summary.byCategory).length > 0 && (
                <Card>
                  <Text style={styles.sectionTitle}>Por categoria</Text>
                  {Object.entries(summary.byCategory).map(([cat, total]) => (
                    <View key={cat} style={styles.row}>
                      <Text style={styles.label}>{cat}</Text>
                      <Text style={styles.value}>{formatCurrency(total)}</Text>
                    </View>
                  ))}
                </Card>
              )}

              <Text style={styles.sectionTitle}>Lançamentos</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="💰"
            title="Sem lançamentos"
            description="Adicione o primeiro gasto desta obra"
            actionLabel="Registrar gasto"
            onAction={() => navigation.navigate('CreateExpense', { workId })}
          />
        }
        renderItem={({ item }) => (
          <Card>
            <View style={styles.expenseRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expenseDesc}>{item.description}</Text>
                <Text style={styles.expenseMeta}>
                  {item.category} · {formatDate(item.date)}
                </Text>
              </View>
              <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
            </View>
            <Pressable
              onPress={() =>
                Alert.alert('Excluir lançamento', 'Confirma a exclusão?', [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => deleteExpense.mutate(item.id),
                  },
                ])
              }
              hitSlop={6}
            >
              <Text style={styles.removeText}>Remover</Text>
            </Pressable>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
    flexGrow: 1,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: { color: theme.colors.textMuted, fontSize: theme.fontSize.md },
  value: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  expenseDesc: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  expenseMeta: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: 2,
  },
  expenseAmount: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
  },
  removeText: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
    alignSelf: 'flex-end',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: theme.colors.onPrimary,
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
    lineHeight: 24,
  },
});
