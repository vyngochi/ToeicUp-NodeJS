"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const redis_1 = require("./config/redis");
const prisma_1 = require("./config/prisma");
const config_1 = require("./config");
app_1.default.listen(config_1.config.port, () => {
    console.log(`Server is running at port: ${config_1.config.port}`);
    console.log("😍 Swagger API: " + `http://localhost:${config_1.config.port}/api-docs`);
});
redis_1.redis.ping().then(() => console.log("Redis connected"));
process.on("SIGTERM", async () => {
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
