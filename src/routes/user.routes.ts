import { Router } from "express";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";
import { setGoalController } from "../controllers/user/setGoal.controller";
import { userSchemas } from "../schemas/user.schema";

const router = Router();

router.put(
  "/set-goal",
  validate(userSchemas.setGoalSchema),
  authenticate,
  setGoalController,
);

export default router;
