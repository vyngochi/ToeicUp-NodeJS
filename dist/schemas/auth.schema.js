"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.authSchema = {
    loginSchema: zod_1.default.object({
        email: zod_1.default.email("Email không đúng định dạng"),
        password: zod_1.default.string().min(1, "Vui lòng nhập mật khẩu"),
    }),
    registerSchema: zod_1.default
        .object({
        email: zod_1.default.email("Email không đúng định dạng"),
        password: zod_1.default
            .string()
            .min(8, "Mật khẩu tối thiểu 8 ký tự")
            .max(30, "Mật khẩu tối đa 30 ký tự")
            .regex(/[a-z]/, "Phải có ít nhất 1 chữ thường")
            .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
            .regex(/\d/, "Phải có ít nhất 1 số")
            .regex(/[\W_]/, "Phải có ít nhất 1 ký tự đặc biệt"),
        confirmPassword: zod_1.default.string().min(1, "Vui lòng nhập mật khẩu xác nhận"),
        fullName: zod_1.default.string().min(1, "Vui lòng nhập đầy đủ họ và tên"),
        targetScore: zod_1.default
            .number()
            .min(450, "Điểm mục tiêu phải lớn hơn hoặc bằng 450")
            .max(990, "điểm mục tiêu phải nhỏ hơn hoặc bằng 990"),
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    }),
};
