import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

interface Props {
  children: ReactNode;
  padded?: boolean;
}

export function Screen({ children, padded = false }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.inner, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  inner: { flex: 1 },
  padded: { padding: theme.spacing.lg },
});
