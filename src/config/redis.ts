import { Redis } from "@upstash/redis";
import { config } from ".";

export const redis = new Redis({
  url: config.redis.url!,
  token: config.redis.token!,
});
