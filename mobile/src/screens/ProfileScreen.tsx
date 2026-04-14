import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { theme } from '../theme';

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  function confirmSignOut() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <Screen>
      <Header title="Perfil" subtitle="Suas informações" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name ?? '-'}</Text>
          <Text style={styles.email}>{user?.email ?? '-'}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Sobre o app</Text>
          <Text style={styles.aboutText}>
            BuildFlow é um app de gestão de obras — controle do progresso, etapas, tarefas e
            financeiro de cada projeto em um só lugar.
          </Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </Card>

        <Button title="Sair" variant="danger" onPress={confirmSignOut} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.onPrimary,
    fontSize: 30,
    fontWeight: theme.fontWeight.bold,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
  },
  email: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  aboutText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
  version: {
    color: theme.colors.textDim,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.md,
  },
});
