import z from "zod";

export const userSchemas = {
  setGoalSchema: z.object({
    targetScore: z
      .number()
      .min(450, "Vui lòng chọn điểm lớn hơn hoặc bằng 450")
      .max(900, "Vui lòng chọn điểm thấp hơn hoặc bằng 990"),
    wordsPerDay: z
      .number()
      .min(5, "Vui lòng chọn số từ vựng lớn hơn hoặc bằng 5")
      .max(30, "Vui lòng chọn số từ vựng nhỏ hơn hoặc bằng 20"),
  }),

  userUpdateInformationSchema: z.object({
    email: z.email("Email không hợp lệ"),
    firstName: z.string().min(1, "Tên không được để trống"),
    lastName: z.string().min(1, "Họ không được để trống"),
    bio: z
      .string()
      .max(1000, "Số lượng kí tự Bio phải nhỏ hơn 1000")
      .optional(),
  }),
};
