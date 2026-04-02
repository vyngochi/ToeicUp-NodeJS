"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    jwt: {
        secret: process.env.JWT_SECRET,
        accessTtl: process.env.JWT_ACCESS_TTL || "5m",
        refreshDays: Number(process.env.JWT_REFRESH_DAYS) || 7,
    },
    redis: {
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
        host: process.env.REDIS_HOST || "localhost", // Local
        port: Number(process.env.REDIS_PORT) || 6379,
    },
};
