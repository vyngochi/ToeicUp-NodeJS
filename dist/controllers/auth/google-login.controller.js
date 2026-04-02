"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithGGController = void 0;
const auth_service_1 = require("../../services/auth/auth.service");
const responseHelper_1 = require("../../libs/responseHelper");
const cookie_1 = require("../../constants/cookie");
const loginWithGGController = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        const deviceInfo = req.headers["user-agent"];
        const ip = req.ip;
        const response = await auth_service_1.authService.loginWithGG(idToken, deviceInfo, ip);
        const user = {
            id: response.user.Id,
            email: response.user.Email,
            displayName: response.user.DisplayName,
            targetScore: response.user.TargetScore,
            streak: response.user.Streak,
            avatarUrl: response.user.AvatarUrl,
            wordsPerDay: response.user.WordsPerDay,
        };
        res.cookie(cookie_1.REFRESH_COOKIE, response.refreshToken, cookie_1.COOKIE_OPTIONS);
        (0, responseHelper_1.successResponse)(res, 200, "Login thành công", user);
    }
    catch (error) {
        next(error);
    }
};
exports.loginWithGGController = loginWithGGController;
