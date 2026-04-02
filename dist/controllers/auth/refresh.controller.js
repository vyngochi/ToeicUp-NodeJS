"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshController = void 0;
const cookie_1 = require("../../constants/cookie");
const auth_service_1 = require("../../services/auth/auth.service");
const responseHelper_1 = require("../../libs/responseHelper");
const refreshController = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[cookie_1.REFRESH_COOKIE];
        const deviceInfo = req.headers["user-agent"];
        const ip = req.ip;
        const result = await auth_service_1.authService.refresh(refreshToken, deviceInfo, ip);
        (0, responseHelper_1.successResponse)(res.cookie(cookie_1.REFRESH_COOKIE, result?.refreshToken, cookie_1.COOKIE_OPTIONS), 200, "Làm mới token thành công", { accessToken: result?.accessToken, user: result?.user });
    }
    catch (error) {
        res.clearCookie(cookie_1.REFRESH_COOKIE);
        next(error);
    }
};
exports.refreshController = refreshController;
