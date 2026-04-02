"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = void 0;
const cookie_1 = require("../../constants/cookie");
const auth_service_1 = require("../../services/auth/auth.service");
const responseHelper_1 = require("../../libs/responseHelper");
const logoutController = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[cookie_1.REFRESH_COOKIE];
        const authHeader = req.headers.authorization;
        const token = authHeader.slice(7);
        await auth_service_1.authService.logout(token, refreshToken);
        (0, responseHelper_1.successResponse)(res.clearCookie(cookie_1.REFRESH_COOKIE), 200, "Logout thành công");
    }
    catch (error) {
        next(error);
    }
};
exports.logoutController = logoutController;
