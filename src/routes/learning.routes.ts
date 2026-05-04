import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getListWordSetsController } from "../controllers/learning/getListWordSets.controller";

const router = Router();

router.get("/word-sets", authenticate, getListWordSetsController);

export default router;
