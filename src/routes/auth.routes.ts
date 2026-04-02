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
} from "../controllers/auth";

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
router.post("/google", limiter(15, 10), loginWithGGController);
router.post("/refresh", authenticate, limiter(15, 10), refreshController);
router.post("/logout", authenticate, logoutController);

export default router;
