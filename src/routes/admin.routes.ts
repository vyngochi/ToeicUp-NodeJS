import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import {
  addBulkWordsSchema,
  addWordSchema,
} from "../schemas/vocabulary.schema";
import { vocabularyController } from "../controllers/admin/vocabulary.controller";
import { getAllWordSets } from "../controllers/learning/getAllWordSets.controller";
import { getListVocabsByWordSetId } from "../controllers/admin/getListVocabs.controller";

const router = Router();

router.use(authenticate, authorize("Admin"));

router.get("/vocabulary/:wordSetId", getListVocabsByWordSetId);
router.post("/words", validate(addWordSchema), vocabularyController.addWord);
router.post(
  "/words/bulk",
  validate(addBulkWordsSchema),
  vocabularyController.addBulkWords,
);
router.get("/all-word-sets", getAllWordSets);
router.put("/word-set/delete/:wordSetId", vocabularyController.deleteWordSet);

export default router;
