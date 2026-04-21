import { Router } from "express";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";
import { setGoalController } from "../controllers/user/setGoal.controller";
import { userSchemas } from "../schemas/user.schema";
import { UpdateUserInfoController } from "../controllers/user/updateUserInformation.controller";
import { UploadAvatarController } from "../controllers/user/uploadAvatar.controller";

const router = Router();

router.put(
  "/set-goal",
  validate(userSchemas.setGoalSchema),
  authenticate,
  setGoalController,
);
router.put(
  "/update-information",
  validate(userSchemas.userUpdateInformationSchema),
  authenticate,
  UpdateUserInfoController,
);
router.put("/upload-avatar", authenticate, UploadAvatarController);

export default router;
