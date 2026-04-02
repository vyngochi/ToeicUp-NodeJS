"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = void 0;
const auth_service_1 = require("../../services/auth/auth.service");
const responseHelper_1 = require("../../libs/responseHelper");
const registerController = async (req, res, next) => {
    try {
        const registerData = req.body;
        const { message } = await auth_service_1.authService.register(registerData);
        (0, responseHelper_1.successResponse)(res, 201, message);
    }
    catch (error) {
        next(error);
    }
};
exports.registerController = registerController;
