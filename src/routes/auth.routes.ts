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
} from "../controllers/auth";
import {
  forgotPasswordController,
  resetPasswordForgotController,
} from "../controllers/auth/forgot-password.controller";
import { setPasswordController } from "../controllers/auth/set-password.controller";

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
router.post("/logout", authenticate, logoutController);

export default router;
