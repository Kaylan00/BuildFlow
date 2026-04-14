import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Work } from '../types';
import { theme } from '../theme';
import { formatCurrency } from '../utils/format';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { RiskBadge, StatusBadge } from './Badge';

interface Props {
  work: Work;
  onPress?: () => void;
}

export function WorkCard({ work, onPress }: Props) {
  return (
    <Card onPress={onPress} style={styles.card}>
      {work.coverImage ? (
        <Image source={{ uri: work.coverImage }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Text style={styles.coverEmoji}>🏗️</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {work.name}
        </Text>
        {work.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {work.description}
          </Text>
        ) : null}
        <View style={styles.badges}>
          <StatusBadge status={work.status} />
          <RiskBadge risk={work.risk} />
        </View>
        <ProgressBar value={work.progress} label="Progresso" />
        <Text style={styles.budget}>Orçamento: {formatCurrency(work.budget)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 130,
    backgroundColor: theme.colors.surfaceAlt,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverEmoji: { fontSize: 48 },
  body: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
  },
  budget: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
});
