import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getListWordSetsController } from "../controllers/learning/getListWordSetsWithTopics.controller";
import { getListVocabByWordSetIdForLeaner } from "../controllers/learning/getListVocabsForLearner.controller";
import { getDailyReviewWordsController, submitWordReviewController, getSrsStatsController } from "../controllers/learning/srs.controller";
import { getDashboardWordSetsController } from "../controllers/learning/dashboard.controller";

const router = Router();

router.use(authenticate);

router.get("/word-sets", getListWordSetsController);
router.get("/vocabulary/:wordSetId", getListVocabByWordSetIdForLeaner);

// Dashboard routes
router.get("/dashboard/word-sets", getDashboardWordSetsController);

// SRS Routes
router.get("/srs/daily", getDailyReviewWordsController);
router.post("/srs/review", submitWordReviewController);
router.get("/srs/stats", getSrsStatsController);

export default router;
