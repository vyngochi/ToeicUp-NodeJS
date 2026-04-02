"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const config_1 = require("@app/config");
const redis_1 = require("@app/config/redis");
const responseHelper_1 = require("@app/libs/responseHelper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return (0, responseHelper_1.errorResponse)(res, 401, "Unauthorized");
    }
    const token = authHeader.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        const blacklisted = await redis_1.redis.get(`blacklist:${payload.id}`);
        if (blacklisted) {
            return (0, responseHelper_1.errorResponse)(res, 401, "Token revoked");
        }
        req.user = { userId: payload.id, email: payload.email, role: payload.role };
        next();
    }
    catch (error) {
        return (0, responseHelper_1.errorResponse)(res, 401, "Invalid token");
    }
};
exports.authenticate = authenticate;
