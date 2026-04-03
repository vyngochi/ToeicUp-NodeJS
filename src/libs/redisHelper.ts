import { redis } from "../config/redis";

export const blacklistToken = {
  async setBlacklist(jti: string, ttl: number) {
    await redis.setex(`blacklist:${jti}`, ttl, "1");
  },

  async getBlacklist(jti: string) {
    return await redis.get(`blacklist:${jti}`);
  },
};
