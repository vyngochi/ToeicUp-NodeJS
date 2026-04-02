import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  backendUrl: process.env.BACKEND_URL!,
  frontendUrl: process.env.FRONTEND_URL!,
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessTtl: process.env.JWT_ACCESS_TTL || "5m",
    refreshDays: Number(process.env.JWT_REFRESH_DAYS) || 7,
  },
  redis: {
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
    host: process.env.REDIS_HOST || "localhost", // Local
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  mail: {
    host: process.env.MAIL_HOST!,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_NAME,
    pass: process.env.MAIL_PASS,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
  },
};
