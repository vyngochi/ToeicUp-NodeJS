import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  backendUrl: process.env.BACKEND_URL!,
  frontendUrl: process.env.FRONTEND_URL!,
  dbUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessTtl: process.env.JWT_ACCESS_TTL || "5m",
    refreshDays: Number(process.env.JWT_REFRESH_DAYS) || 7,
  },
  redis: {
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  mail: {
    API_KEY: process.env.MAIL_API_KEY!,
    USER: process.env.USER,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
  },
};
