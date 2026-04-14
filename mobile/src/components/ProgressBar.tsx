import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface Props {
  value: number; // 0-100
  label?: string;
  color?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ value, label, color = theme.colors.primary, showPercentage = true }: Props) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <View>
      {(label || showPercentage) && (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercentage ? <Text style={styles.percentage}>{safe}%</Text> : null}
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${safe}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  percentage: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  track: {
    height: 8,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.pill,
  },
});
