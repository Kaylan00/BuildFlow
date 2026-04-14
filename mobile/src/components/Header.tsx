import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export function Header({ title, subtitle, onBack, rightAction }: Props) {
  return (
    <View style={styles.wrapper}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : (
        <View style={{ width: 32 }} />
      )}
      <View style={styles.titleWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>{rightAction ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  back: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  backText: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: theme.fontWeight.bold,
    lineHeight: 24,
  },
  titleWrap: { flex: 1 },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  right: { minWidth: 32, alignItems: 'flex-end' },
});
