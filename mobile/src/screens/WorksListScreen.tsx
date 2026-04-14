import React from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { WorkCard } from '../components/WorkCard';
import { useWorks } from '../hooks/useWorks';
import { theme } from '../theme';
import { WorksStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<WorksStackParamList, 'WorksList'>;

export function WorksListScreen() {
  const navigation = useNavigation<Nav>();
  const { data, isLoading, isRefetching, refetch } = useWorks();

  if (isLoading) return <Loading message="Carregando obras..." />;

  return (
    <Screen>
      <Header
        title="Obras"
        subtitle={data ? `${data.length} obra(s)` : undefined}
        rightAction={
          <Pressable
            onPress={() => navigation.navigate('CreateEditWork')}
            hitSlop={10}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        }
      />

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.md }} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🏗️"
            title="Sem obras ainda"
            description="Crie sua primeira obra para começar"
            actionLabel="Criar obra"
            onAction={() => navigation.navigate('CreateEditWork')}
          />
        }
        renderItem={({ item }) => (
          <WorkCard
            work={item}
            onPress={() => navigation.navigate('WorkDetails', { workId: item.id })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: theme.colors.onPrimary,
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
    lineHeight: 24,
  },
});
