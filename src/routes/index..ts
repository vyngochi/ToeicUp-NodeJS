import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import learningRoutes from "./learning.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/learning", learningRoutes);

export default router;
