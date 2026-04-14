import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { RiskLevel, WorkStatus } from '../types';
import { riskLabel, workStatusLabel } from '../utils/format';

const statusColor: Record<WorkStatus | 'pending', string> = {
  planning: theme.colors.info,
  in_progress: theme.colors.primary,
  paused: theme.colors.textMuted,
  completed: theme.colors.success,
  pending: theme.colors.textMuted,
};

const riskColor: Record<RiskLevel, string> = {
  low: theme.colors.success,
  medium: theme.colors.warning,
  high: theme.colors.danger,
};

export function StatusBadge({ status }: { status: WorkStatus | 'pending' }) {
  const color = statusColor[status] ?? theme.colors.textMuted;
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{workStatusLabel(status)}</Text>
    </View>
  );
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const color = riskColor[risk];
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: `${color}22` }]}>
      <Text style={[styles.text, { color }]}>⚠ Risco {riskLabel(risk)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    gap: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
  },
});
