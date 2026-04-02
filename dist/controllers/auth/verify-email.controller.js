"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRegisterEmail = void 0;
const mail_service_1 = require("../../services/mail/mail.service");
const responseHelper_1 = require("../../libs/responseHelper");
const verifyRegisterEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        const deviceInfo = req.headers["user-agent"];
        const ip = req.ip;
        const { accessToken, refreshToken, user } = await mail_service_1.mailService.verifyEmail(token, deviceInfo, ip);
        (0, responseHelper_1.successResponse)(res, 200, "Tài khoản đã được xác thực", {
            accessToken,
            refreshToken,
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyRegisterEmail = verifyRegisterEmail;
