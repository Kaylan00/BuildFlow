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
import { SignInValues, signInSchema } from '../schemas/auth';
import { useSignIn } from '../hooks/useAuth';
import { theme } from '../theme';
import { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function SignInScreen() {
  const navigation = useNavigation<Nav>();
  const signIn = useSignIn();

  const { control, handleSubmit, formState } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: SignInValues) {
    try {
      await signIn.mutateAsync(values);
    } catch {
      // Error is shown below via signIn.error
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <Text style={styles.logo}>BuildFlow</Text>
            <Text style={styles.tagline}>Gestão de obras de verdade</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

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

            {signIn.isError && (
              <Text style={styles.error}>{(signIn.error as Error).message}</Text>
            )}

            <Button
              title="Entrar"
              onPress={handleSubmit(onSubmit)}
              loading={signIn.isPending || formState.isSubmitting}
            />

            <Pressable onPress={() => navigation.navigate('SignUp')} style={styles.link}>
              <Text style={styles.linkText}>
                Ainda não tem conta? <Text style={styles.linkHighlight}>Cadastre-se</Text>
              </Text>
            </Pressable>
          </View>
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
  brand: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logo: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.display,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 0.5,
  },
  tagline: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xs,
  },
  form: {
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.lg,
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
