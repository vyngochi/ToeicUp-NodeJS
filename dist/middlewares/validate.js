"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = exports.validate = void 0;
const responseHelper_1 = require("../libs/responseHelper");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const zod_1 = __importDefault(require("zod"));
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return (0, responseHelper_1.errorResponse)(res, 400, "Validation error", zod_1.default.flattenError(result.error).fieldErrors);
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
const limiter = (time, max) => (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: { message: "Login quá nhiều lần, hãy thử lại sau 15 phút " },
});
exports.limiter = limiter;
