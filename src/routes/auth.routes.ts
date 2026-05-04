import { Router } from "express";
import { limiter, validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";
import { authSchema } from "../schemas/auth.schema";
import {
  loginController,
  loginWithGGController,
  logoutController,
  refreshController,
  registerController,
  verifyRegisterEmail,
  setPasswordController,
  forgotPasswordController,
  resetPasswordForgotController,
} from "../controllers/auth";
import { setPasswordMeController } from "../controllers/auth/set-password-me.controller";

const router = Router();

router.post(
  "/register",
  validate(authSchema.registerSchema),
  limiter(5, 10),
  registerController,
);
router.post("/verify-email", limiter(15, 10), verifyRegisterEmail);
router.post(
  "/login",
  validate(authSchema.loginSchema),
  limiter(15, 10),
  loginController,
);
router.post("/google", limiter(15, 10), loginWithGGController);
router.post("/refresh", refreshController);
router.post(
  "/forgot-password",
  validate(authSchema.forgotSchema),
  limiter(15, 10),
  forgotPasswordController,
);
router.post(
  "/reset-password",
  validate(authSchema.resetPasswordSchema),
  limiter(15, 10),
  resetPasswordForgotController,
);
router.post(
  "/set-password",
  validate(authSchema.setPasswordSchema),
  setPasswordController,
);
router.put(
  "/set-password/me",
  authenticate,
  validate(authSchema.setPasswordMeSchema),
  setPasswordMeController,
);
router.post("/logout", authenticate, logoutController);

export default router;
