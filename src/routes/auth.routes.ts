import { loginController } from "../controllers/auth/login.controller";
import { Router } from "express";
import { limiter, validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";
import { logoutController } from "../controllers/auth/logout.controller";
import { registerController } from "../controllers/auth/register.controller";
import { authSchema } from "../schemas/auth.schema";

const router = Router();

router.post(
  "/register",
  validate(authSchema.registerSchema),
  limiter(5, 10),
  registerController,
);
router.post(
  "/login",
  validate(authSchema.loginSchema),
  limiter(15, 10),
  loginController,
);
router.post("/logout", authenticate, logoutController);

export default router;
