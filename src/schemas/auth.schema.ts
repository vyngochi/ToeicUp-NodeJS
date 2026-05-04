import z, { email } from "zod";

export const authSchema = {
  loginSchema: z.object({
    email: z.email("Email không đúng định dạng"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  }),

  registerSchema: z
    .object({
      email: z.email("Email không đúng định dạng"),
      password: z
        .string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .max(30, "Mật khẩu tối đa 30 ký tự")
        .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
        .regex(/[A-Z]/, "Mật khẩu phải  có ít nhất 1 chữ hoa")
        .regex(/\d/, "Mật khẩu phải  có ít nhất 1 số")
        .regex(/[\W_]/, "Mật khẩu phải  có ít nhất 1 ký tự đặc biệt"),
      confirmPassword: z.string().min(1, "Vui lòng nhập mật khẩu xác nhận"),
      firstName: z.string().min(1, "Vui lòng nhập tên"),
      lastName: z.string().min(1, "Vui lòng nhập họ"),
      targetScore: z
        .number()
        .min(450, "Điểm mục tiêu phải lớn hơn hoặc bằng 450")
        .max(990, "điểm mục tiêu phải nhỏ hơn hoặc bằng 990"),
      wordsPerDay: z
        .number()
        .min(5, "Vui lòng chọn số từ vựng học mỗi ngày lớn hơn 5"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    }),

  forgotSchema: z.object({
    email: z.email("Email không hợp lệ"),
  }),

  resetPasswordSchema: z
    .object({
      token: z
        .string("Token không tồn tại")
        .min(1, "Token không hợp lệ. Vui lòng thử lại"),
      newPassword: z
        .string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .max(30, "Mật khẩu tối đa 30 ký tự")
        .regex(/[a-z]/, "Phải có ít nhất 1 chữ thường")
        .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
        .regex(/\d/, "Phải có ít nhất 1 số")
        .regex(/[\W_]/, "Phải có ít nhất 1 ký tự đặc biệt"),
      confirmPassword: z.string().min(1, "Vui lòng nhập mật khẩu xác nhận"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu khôg khớp",
      path: ["confirmPassword"],
    }),

  setPasswordSchema: z
    .object({
      token: z.string().min(1, "Token không hợp lệ. Vui lòng thử lại"),
      newPassword: z
        .string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .max(30, "Mật khẩu tối đa 30 ký tự")
        .regex(/[a-z]/, "Phải có ít nhất 1 chữ thường")
        .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
        .regex(/\d/, "Phải có ít nhất 1 số")
        .regex(/[\W_]/, "Phải có ít nhất 1 ký tự đặc biệt"),
      confirmPassword: z.string().min(1, "Vui lòng nhập mật khẩu xác nhận"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    }),
  setPasswordMeSchema: z
    .object({
      newPassword: z
        .string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .max(30, "Mật khẩu tối đa 30 ký tự")
        .regex(/[a-z]/, "Phải có ít nhất 1 chữ thường")
        .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
        .regex(/\d/, "Phải có ít nhất 1 số")
        .regex(/[\W_]/, "Phải có ít nhất 1 ký tự đặc biệt"),
      confirmPassword: z.string().min(1, "Vui lòng nhập mật khẩu xác nhận"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    }),
};
