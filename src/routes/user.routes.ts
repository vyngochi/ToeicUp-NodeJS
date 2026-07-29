import { Router } from "express";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";
import { setGoalController } from "../controllers/user/setGoal.controller";
import { userSchemas } from "../schemas/user.schema";
import { UpdateUserInfoController } from "../controllers/user/updateUserInformation.controller";
import { UploadAvatarController } from "../controllers/user/uploadAvatar.controller";

const router = Router();

router.use(authenticate);

router.put("/set-goal", validate(userSchemas.setGoalSchema), setGoalController);
router.put(
  "/update-information",
  validate(userSchemas.userUpdateInformationSchema),
  UpdateUserInfoController,
);
router.put("/upload-avatar", UploadAvatarController);

export default router;
