import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WorksStack } from './WorksStack';
import { AppTabParamList } from './types';
import { theme } from '../theme';

const Tab = createBottomTabNavigator<AppTabParamList>();

function tabIcon(label: string) {
  return ({ focused }: { focused: boolean }) => (
    <View style={styles.icon}>
      <Text style={[styles.iconText, focused && styles.iconActive]}>{label}</Text>
    </View>
  );
}

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.bar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: tabIcon('◉') }}
      />
      <Tab.Screen
        name="Works"
        component={WorksStack}
        options={{ tabBarIcon: tabIcon('▣'), title: 'Obras' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: tabIcon('◎'), title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    paddingTop: 6,
    height: 64,
  },
  label: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
  },
  icon: { alignItems: 'center', justifyContent: 'center' },
  iconText: {
    fontSize: 18,
    color: theme.colors.textMuted,
  },
  iconActive: { color: theme.colors.primary },
});
