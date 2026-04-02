"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("@upstash/redis");
const _1 = require(".");
exports.redis = new redis_1.Redis({
    url: _1.config.redis.url,
    token: _1.config.redis.token,
});
