import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export interface Option<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  error?: string;
}

export function Select<T extends string>({ label, value, onChange, options, error }: Props<T>) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={({ pressed }) => [
                styles.option,
                active && styles.optionActive,
                pressed && !active && styles.pressed,
              ]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: theme.spacing.md },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  option: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
  },
  optionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  optionTextActive: {
    color: theme.colors.onPrimary,
    fontWeight: theme.fontWeight.semibold,
  },
  pressed: { opacity: 0.85 },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
});
