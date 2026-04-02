import app from "./app";
import { redis } from "./config/redis";
import { prisma } from "./config/prisma";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`Server is running at port: ${config.port}`);
  console.log("😍 Swagger API: " + `http://localhost:${config.port}/api-docs`);
});

redis.ping().then(() => console.log("Redis connected"));

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
