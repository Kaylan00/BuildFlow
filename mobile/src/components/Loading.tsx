import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface Props {
  message?: string;
}

export function Loading({ message }: Props) {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
  },
});
