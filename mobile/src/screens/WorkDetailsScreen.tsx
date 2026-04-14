import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge, RiskBadge } from '../components/Badge';
import { Timeline } from '../components/Timeline';
import { Input } from '../components/Input';
import { useWork, useDeleteWork, useUpdateWork } from '../hooks/useWorks';
import {
  useAddTask,
  useDeleteStage,
  useRemoveTask,
  useToggleTask,
} from '../hooks/useStages';
import { theme } from '../theme';
import { formatCurrency, formatDate } from '../utils/format';
import { WorksStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<WorksStackParamList, 'WorkDetails'>;
type Rt = RouteProp<WorksStackParamList, 'WorkDetails'>;

export function WorkDetailsScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { workId } = params;

  const { data, isLoading, isRefetching, refetch } = useWork(workId);
  const updateWork = useUpdateWork();
  const deleteWork = useDeleteWork();

  const addTask = useAddTask(workId);
  const toggleTask = useToggleTask(workId);
  const removeTask = useRemoveTask(workId);
  const deleteStage = useDeleteStage(workId);

  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});

  async function pickCover() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissão negada', 'Não foi possível acessar suas fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true,
    });
    if (result.canceled || !result.assets?.[0]?.base64) return;
    const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
    updateWork.mutate({ id: workId, payload: { coverImage: uri } });
  }

  function confirmDelete() {
    Alert.alert('Excluir obra', 'Tem certeza? Esta ação remove tudo da obra.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteWork.mutateAsync(workId);
          navigation.goBack();
        },
      },
    ]);
  }

  if (isLoading || !data) return <Loading message="Carregando obra..." />;

  const budget = data.budget;
  const spent = data.totalSpent;
  const remaining = budget - spent;
  const overBudget = spent > budget && budget > 0;

  return (
    <Screen>
      <Header
        title={data.name}
        onBack={() => navigation.goBack()}
        rightAction={
          <Pressable
            onPress={() => navigation.navigate('CreateEditWork', { workId })}
            hitSlop={10}
          >
            <Text style={styles.edit}>Editar</Text>
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Pressable onPress={pickCover}>
          {data.coverImage ? (
            <Image source={{ uri: data.coverImage }} style={styles.cover} />
          ) : (
            <View style={[styles.cover, styles.coverFallback]}>
              <Text style={styles.coverEmoji}>🏗️</Text>
              <Text style={styles.coverHint}>Toque para adicionar foto</Text>
            </View>
          )}
        </Pressable>

        {data.description ? <Text style={styles.description}>{data.description}</Text> : null}

        <View style={styles.badges}>
          <StatusBadge status={data.status} />
          <RiskBadge risk={data.risk} />
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Progresso</Text>
          <ProgressBar value={data.progress} />
          <Text style={styles.meta}>
            Iniciada em {formatDate(data.startDate)}
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Financeiro</Text>
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Orçamento previsto</Text>
            <Text style={styles.financeValue}>{formatCurrency(budget)}</Text>
          </View>
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Realizado</Text>
            <Text style={[styles.financeValue, overBudget && { color: theme.colors.danger }]}>
              {formatCurrency(spent)}
            </Text>
          </View>
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Saldo</Text>
            <Text
              style={[
                styles.financeValue,
                { color: remaining >= 0 ? theme.colors.success : theme.colors.danger },
              ]}
            >
              {formatCurrency(remaining)}
            </Text>
          </View>
          <Button
            title="Gerenciar financeiro"
            variant="secondary"
            onPress={() => navigation.navigate('Finance', { workId })}
          />
        </Card>

        <View style={styles.stagesHeader}>
          <Text style={styles.sectionTitle}>Etapas & tarefas</Text>
          <Pressable
            onPress={() => navigation.navigate('CreateStage', { workId })}
            hitSlop={8}
          >
            <Text style={styles.addLink}>+ Nova etapa</Text>
          </Pressable>
        </View>

        {data.stages.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>
              Nenhuma etapa criada. Adicione uma para começar.
            </Text>
          </Card>
        ) : (
          data.stages.map((stage) => {
            const input = taskInputs[stage.id] ?? '';
            return (
              <Card key={stage.id}>
                <View style={styles.stageHeader}>
                  <Text style={styles.stageName}>{stage.name}</Text>
                  <Pressable
                    onPress={() =>
                      Alert.alert('Excluir etapa', `Remover "${stage.name}"?`, [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Excluir',
                          style: 'destructive',
                          onPress: () => deleteStage.mutate(stage.id),
                        },
                      ])
                    }
                    hitSlop={8}
                  >
                    <Text style={styles.removeText}>Remover</Text>
                  </Pressable>
                </View>
                {stage.description ? (
                  <Text style={styles.stageDesc}>{stage.description}</Text>
                ) : null}
                <ProgressBar value={stage.progress} />

                <View style={styles.taskList}>
                  {stage.tasks.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma tarefa ainda.</Text>
                  ) : (
                    stage.tasks.map((task) => (
                      <View key={task.id} style={styles.taskRow}>
                        <Pressable
                          onPress={() =>
                            toggleTask.mutate({ stageId: stage.id, taskId: task.id })
                          }
                          style={[
                            styles.checkbox,
                            task.done && styles.checkboxDone,
                          ]}
                        >
                          {task.done ? <Text style={styles.checkMark}>✓</Text> : null}
                        </Pressable>
                        <Text
                          style={[styles.taskTitle, task.done && styles.taskDone]}
                          numberOfLines={2}
                        >
                          {task.title}
                        </Text>
                        <Pressable
                          onPress={() =>
                            removeTask.mutate({ stageId: stage.id, taskId: task.id })
                          }
                          hitSlop={6}
                        >
                          <Text style={styles.removeIcon}>×</Text>
                        </Pressable>
                      </View>
                    ))
                  )}
                </View>

                <View style={styles.addTaskRow}>
                  <View style={{ flex: 1 }}>
                    <Input
                      placeholder="Nova tarefa..."
                      value={input}
                      onChangeText={(v) =>
                        setTaskInputs((prev) => ({ ...prev, [stage.id]: v }))
                      }
                    />
                  </View>
                  <Button
                    title="Adicionar"
                    fullWidth={false}
                    onPress={async () => {
                      const title = input.trim();
                      if (!title) return;
                      await addTask.mutateAsync({ stageId: stage.id, title });
                      setTaskInputs((prev) => ({ ...prev, [stage.id]: '' }));
                    }}
                  />
                </View>
              </Card>
            );
          })
        )}

        <Card>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <Timeline stages={data.stages} />
        </Card>

        <Button
          title="Excluir obra"
          variant="danger"
          onPress={confirmDelete}
          loading={deleteWork.isPending}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  edit: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.md,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceAlt,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  coverEmoji: { fontSize: 56 },
  coverHint: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.sm,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  financeLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
  },
  financeValue: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  stagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addLink: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    paddingVertical: theme.spacing.sm,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  stageName: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    flex: 1,
  },
  removeText: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
  },
  stageDesc: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
  },
  taskList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  checkMark: { color: '#fff', fontWeight: theme.fontWeight.bold },
  taskTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    flex: 1,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: theme.colors.textDim,
  },
  removeIcon: {
    color: theme.colors.textMuted,
    fontSize: 22,
    paddingHorizontal: 4,
  },
  addTaskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
});
