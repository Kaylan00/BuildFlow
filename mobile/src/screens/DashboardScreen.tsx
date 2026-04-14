import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { WorkCard } from '../components/WorkCard';
import { ProgressBar } from '../components/ProgressBar';
import { useDashboard } from '../hooks/useWorks';
import { useAuthStore } from '../store/authStore';
import { theme } from '../theme';
import { formatCurrency, workStatusLabel } from '../utils/format';
import { AppTabParamList } from '../navigation/types';

type Nav = BottomTabNavigationProp<AppTabParamList, 'Dashboard'>;

export function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const navigation = useNavigation<Nav>();
  const { data, isLoading, isRefetching, refetch } = useDashboard();

  if (isLoading) return <Loading message="Carregando dashboard..." />;

  return (
    <Screen>
      <Header title={`Olá, ${user?.name?.split(' ')[0] ?? 'você'} 👋`} subtitle="Visão geral das suas obras" />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.colors.primary} />
        }
      >
        {!data || data.totalWorks === 0 ? (
          <EmptyState
            icon="🏗️"
            title="Nenhuma obra cadastrada"
            description="Crie sua primeira obra para começar a acompanhar indicadores por aqui."
            actionLabel="Criar obra"
            onAction={() =>
              navigation.navigate('Works', {
                screen: 'CreateEditWork',
              })
            }
          />
        ) : (
          <>
            <View style={styles.grid}>
              <MetricCard label="Obras" value={String(data.totalWorks)} />
              <MetricCard label="Progresso médio" value={`${data.avgProgress}%`} />
              <MetricCard label="Orçamento" value={formatCurrency(data.totalBudget)} />
              <MetricCard
                label="Gastos"
                value={formatCurrency(data.totalSpent)}
                tone={data.totalSpent > data.totalBudget ? 'danger' : 'success'}
              />
            </View>

            <Card>
              <Text style={styles.sectionTitle}>Progresso geral</Text>
              <ProgressBar value={data.avgProgress} />
              <View style={styles.spentRow}>
                <Text style={styles.spentLabel}>
                  Realizado: {formatCurrency(data.totalSpent)}
                </Text>
                <Text style={styles.spentLabel}>
                  Previsto: {formatCurrency(data.totalBudget)}
                </Text>
              </View>
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>Obras por status</Text>
              <View style={{ gap: theme.spacing.sm }}>
                {Object.entries(data.byStatus).map(([status, count]) => (
                  <View key={status} style={styles.statusRow}>
                    <Text style={styles.statusLabel}>{workStatusLabel(status)}</Text>
                    <Text style={styles.statusCount}>{count}</Text>
                  </View>
                ))}
              </View>
            </Card>

            <Text style={styles.sectionTitle}>Recentes</Text>
            <View style={{ gap: theme.spacing.md }}>
              {data.recentWorks.map((work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  onPress={() =>
                    navigation.navigate('Works', {
                      screen: 'WorkDetails',
                      params: { workId: work.id },
                    })
                  }
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function MetricCard({
  label,
  value,
  tone = 'primary',
}: {
  label: string;
  value: string;
  tone?: 'primary' | 'success' | 'danger';
}) {
  const color = {
    primary: theme.colors.primary,
    success: theme.colors.success,
    danger: theme.colors.danger,
  }[tone];
  return (
    <Card style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metric: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: 4,
  },
  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  metricValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  spentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  spentLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },
  statusCount: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
});
