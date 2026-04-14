import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type WorksStackParamList = {
  WorksList: undefined;
  WorkDetails: { workId: string };
  CreateEditWork: { workId?: string } | undefined;
  CreateStage: { workId: string };
  Finance: { workId: string };
  CreateExpense: { workId: string };
};

export type AppTabParamList = {
  Dashboard: undefined;
  Works: NavigatorScreenParams<WorksStackParamList>;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};
