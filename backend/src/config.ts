export const PORT = Number(process.env.PORT ?? 3333);
export const JWT_SECRET = process.env.JWT_SECRET ?? 'buildflow-dev-secret-change-me';
export const JWT_EXPIRES_IN = '7d';
