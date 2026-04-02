"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const cookie_1 = require("@app/constants/cookie");
const responseHelper_1 = require("@app/libs/responseHelper");
const auth_service_1 = require("@app/services/auth/auth.service");
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const deviceInfo = req.headers["user-agent"];
    const ip = req.ip;
    const { accessToken, refreshToken, user } =
      await auth_service_1.authService.login(email, password, deviceInfo, ip);
    return (0, responseHelper_1.successResponse)(
      res.cookie(
        cookie_1.REFRESH_COOKIE,
        refreshToken,
        cookie_1.COOKIE_OPTIONS,
      ),
      200,
      "Đăng nhập thành công",
      { accessToken, refreshToken, user },
    );
  } catch (error) {
    next(error);
  }
};
exports.loginController = loginController;
