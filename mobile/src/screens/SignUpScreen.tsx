import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '../components/Screen';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { SignUpValues, signUpSchema } from '../schemas/auth';
import { useSignUp } from '../hooks/useAuth';
import { theme } from '../theme';
import { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const signUp = useSignUp();

  const { control, handleSubmit, formState } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: SignUpValues) {
    try {
      await signUp.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
    } catch {
      // shown via signUp.error
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Comece a gerenciar suas obras hoje</Text>
          </View>

          <FormField control={control} name="name" label="Nome completo" placeholder="Seu nome" />
          <FormField
            control={control}
            name="email"
            label="E-mail"
            placeholder="voce@exemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <FormField
            control={control}
            name="password"
            label="Senha"
            placeholder="••••••"
            secureTextEntry
          />
          <FormField
            control={control}
            name="confirmPassword"
            label="Confirmar senha"
            placeholder="••••••"
            secureTextEntry
          />

          {signUp.isError && (
            <Text style={styles.error}>{(signUp.error as Error).message}</Text>
          )}

          <Button
            title="Cadastrar"
            onPress={handleSubmit(onSubmit)}
            loading={signUp.isPending || formState.isSubmitting}
          />

          <Pressable onPress={() => navigation.navigate('SignIn')} style={styles.link}>
            <Text style={styles.linkText}>
              Já tem uma conta? <Text style={styles.linkHighlight}>Entrar</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xs,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  link: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  linkText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  linkHighlight: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
});
