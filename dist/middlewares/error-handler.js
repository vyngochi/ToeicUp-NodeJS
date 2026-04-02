"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const responseHelper_1 = require("./../libs/responseHelper");
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        return (0, responseHelper_1.errorResponse)(res, err.statusCode, err.message);
    }
    console.error(err);
    return (0, responseHelper_1.errorResponse)(res, 500, "Internal server error");
};
exports.errorHandler = errorHandler;
