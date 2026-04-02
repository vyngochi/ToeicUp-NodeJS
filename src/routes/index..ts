import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/Auth", authRoutes);

export default router;
