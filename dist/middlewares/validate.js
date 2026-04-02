"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const responseHelper_1 = require("@app/libs/responseHelper");
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
