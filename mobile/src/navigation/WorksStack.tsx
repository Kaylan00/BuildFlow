import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorksListScreen } from '../screens/WorksListScreen';
import { WorkDetailsScreen } from '../screens/WorkDetailsScreen';
import { CreateEditWorkScreen } from '../screens/CreateEditWorkScreen';
import { CreateStageScreen } from '../screens/CreateStageScreen';
import { FinanceScreen } from '../screens/FinanceScreen';
import { CreateExpenseScreen } from '../screens/CreateExpenseScreen';
import { WorksStackParamList } from './types';

const Stack = createNativeStackNavigator<WorksStackParamList>();

export function WorksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorksList" component={WorksListScreen} />
      <Stack.Screen name="WorkDetails" component={WorkDetailsScreen} />
      <Stack.Screen name="CreateEditWork" component={CreateEditWorkScreen} />
      <Stack.Screen name="CreateStage" component={CreateStageScreen} />
      <Stack.Screen name="Finance" component={FinanceScreen} />
      <Stack.Screen name="CreateExpense" component={CreateExpenseScreen} />
    </Stack.Navigator>
  );
}
