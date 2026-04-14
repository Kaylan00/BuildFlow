import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { Stage } from '../types';
import { workStatusLabel } from '../utils/format';

interface Props {
  stages: Stage[];
}

const stepColor: Record<Stage['status'], string> = {
  pending: theme.colors.textDim,
  in_progress: theme.colors.primary,
  completed: theme.colors.success,
};

export function Timeline({ stages }: Props) {
  if (stages.length === 0) {
    return <Text style={styles.empty}>Nenhuma etapa cadastrada ainda.</Text>;
  }
  return (
    <View style={styles.wrapper}>
      {stages.map((stage, idx) => {
        const color = stepColor[stage.status];
        const last = idx === stages.length - 1;
        return (
          <View key={stage.id} style={styles.row}>
            <View style={styles.indicatorCol}>
              <View style={[styles.dot, { backgroundColor: color, borderColor: color }]} />
              {!last && <View style={styles.line} />}
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{stage.name}</Text>
              <Text style={[styles.status, { color }]}>
                {workStatusLabel(stage.status)} · {stage.progress}%
              </Text>
              {stage.description ? (
                <Text style={styles.description}>{stage.description}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingVertical: theme.spacing.sm },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 16,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: theme.colors.border,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
    gap: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  status: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  empty: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
});
