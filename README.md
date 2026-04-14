# BuildFlow

Aplicativo mobile completo de **gestão de obras** — frontend React Native (Expo) + backend Node/Express com persistência em JSON. Arquitetura de produto real, pronto para portfólio.

![Stack](https://img.shields.io/badge/React_Native-Expo_51-blue) ![TS](https://img.shields.io/badge/TypeScript-strict-3178c6) ![RQ](https://img.shields.io/badge/TanStack_Query-v5-orange) ![Zod](https://img.shields.io/badge/Zod-RHF-10b981)

## Funcionalidades

- **Autenticação** (cadastro, login, sessão persistida com AsyncStorage + JWT)
- **Dashboard** com indicadores: número de obras, orçamento, progresso médio, status
- **Gestão de Obras** (CRUD completo): nome, descrição, status, progresso, risco, orçamento, foto de capa
- **Etapas & Tarefas**: etapas por obra com checklist de tarefas — progresso é calculado automaticamente
- **Financeiro**: orçamento previsto vs realizado, lançamentos por categoria, saldo
- **Timeline** visual do progresso das etapas
- **Indicador de risco**: baixo / médio / alto
- **Upload de imagem** (via `expo-image-picker` em base64)
- **Loading states** e **empty states** em todas as telas
- **Pull-to-refresh** integrado com TanStack Query

## Stack

### Mobile (`/mobile`)
- React Native 0.74 + Expo SDK 51
- TypeScript strict
- React Navigation (Native Stack + Bottom Tabs)
- TanStack Query v5
- Axios com interceptor de token
- Zustand (auth store com hidratação)
- React Hook Form + Zod
- AsyncStorage
- expo-image-picker

### Backend (`/backend`)
- Node.js + Express 4
- TypeScript
- JWT + bcryptjs
- CORS, Morgan
- Persistência em arquivo JSON (fácil de trocar por Postgres depois)

## Estrutura do projeto

```
BuildFlow/
├── backend/
│   └── src/
│       ├── server.ts
│       ├── config.ts
│       ├── db.ts
│       ├── types.ts
│       ├── middlewares/
│       ├── controllers/
│       └── routes/
└── mobile/
    ├── App.tsx
    └── src/
        ├── components/    # UI reutilizável (Button, Input, Card, ProgressBar, Badge, Timeline, ...)
        ├── hooks/         # useAuth, useWorks, useStages, useExpenses (TanStack Query)
        ├── lib/           # api (axios), storage (AsyncStorage), queryClient
        ├── navigation/    # RootNavigator, AuthStack, AppTabs, WorksStack
        ├── schemas/       # Zod schemas (auth, work, stage, expense)
        ├── screens/       # Telas
        ├── services/      # Camada HTTP (auth, works, stages, expenses)
        ├── store/         # Zustand (authStore)
        ├── theme/         # Design tokens
        ├── types/         # Tipos compartilhados
        └── utils/         # Formatadores
```

## Como rodar

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

API disponível em `http://localhost:3333/api`.

### 2. Mobile

```bash
cd mobile
npm install
npm start
```

- Pressione **i** para iOS, **a** para Android ou escaneie o QR code com **Expo Go**.
- Para Android Emulator a URL `localhost` é automaticamente convertida para `10.0.2.2` em `src/lib/api.ts`.
- Para rodar em **dispositivo físico**, edite `mobile/app.json` e troque `extra.apiUrl` para o IP da sua máquina (ex: `http://192.168.0.10:3333/api`).

## Endpoints da API

| Método | Rota                                  | Descrição                      |
|-------:|---------------------------------------|--------------------------------|
| POST   | `/auth/signup`                        | Cadastro                       |
| POST   | `/auth/signin`                        | Login                          |
| GET    | `/auth/me`                            | Usuário autenticado            |
| GET    | `/dashboard`                          | Métricas agregadas             |
| GET    | `/works`                              | Lista de obras                 |
| POST   | `/works`                              | Cria obra                      |
| GET    | `/works/:id`                          | Detalhe (com etapas e totais)  |
| PUT    | `/works/:id`                          | Atualiza obra                  |
| DELETE | `/works/:id`                          | Remove obra                    |
| GET    | `/works/:workId/stages`               | Lista etapas                   |
| POST   | `/works/:workId/stages`               | Cria etapa                     |
| PUT    | `/stages/:stageId`                    | Atualiza etapa                 |
| DELETE | `/stages/:stageId`                    | Remove etapa                   |
| POST   | `/stages/:stageId/tasks`              | Adiciona tarefa                |
| PATCH  | `/stages/:stageId/tasks/:taskId`      | Alterna done (recalcula %)     |
| DELETE | `/stages/:stageId/tasks/:taskId`      | Remove tarefa                  |
| GET    | `/works/:workId/expenses`             | Lista gastos                   |
| POST   | `/works/:workId/expenses`             | Novo gasto                     |
| GET    | `/works/:workId/expenses/summary`     | Previsto vs realizado          |
| DELETE | `/expenses/:expenseId`                | Remove gasto                   |

Todas (exceto `/auth/*`) exigem header `Authorization: Bearer <token>`.

## Scripts úteis

Mobile:
- `npm start` — Expo dev server
- `npm run android` / `npm run ios` / `npm run web`
- `npm run typecheck` — valida a tipagem sem emitir

Backend:
- `npm run dev` — hot reload com `tsx`
- `npm run build` — compila para `dist/`
- `npm start` — roda o build

## Decisões de arquitetura

- **Separação clara de camadas**: services (HTTP) → hooks (TanStack Query) → screens/components. Nenhuma screen importa `axios` diretamente.
- **Query keys centralizadas** em `lib/queryClient.ts` para invalidação consistente.
- **Zustand + AsyncStorage** para sessão (hidratado no boot em `App.tsx`).
- **Design tokens** em `theme/` — nenhum componente hardcoda cores/espaçamentos.
- **Validação única** com Zod nos formulários e nos tipos compartilhados.
- **Interceptor Axios** injeta o JWT automaticamente e normaliza erros para `Error` com `message`.
