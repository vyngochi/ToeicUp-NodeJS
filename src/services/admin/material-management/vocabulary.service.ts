import { HttpStatus } from "../../../constants/enums/status-code";
import {
  ADD_VOCAB_MESSAGE,
  VOCABULARY_MESSAGE,
} from "../../../constants/messages/vocab.message";
import { AppError } from "../../../middlewares/error-handler";
import { AdminVocabularyRepository } from "../../../repositories/admin/vocabulary.repository";
import { VocabularyRepository } from "../../../repositories/vocabulary.repository";
import {
  AddBulkWordsDto,
  AddWordDto,
} from "../../../schemas/vocabulary.schema";

export const AdminVocabManagement = {
  async getVocabulariesByWordSetId(wordSetId: string) {
    if (wordSetId === null) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        VOCABULARY_MESSAGE.GET_VOCAB.NO_WORD_SET_ID,
      );
    }

    const data =
      await AdminVocabularyRepository.getVocabsByWordSetId(wordSetId);

    return { message: VOCABULARY_MESSAGE.GET_VOCAB.RESPONSE.SUCCESS, data };
  },

  async addWord(data: AddWordDto) {
    const existing = await AdminVocabularyRepository.findByTerm(data.term);

    if (existing)
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ADD_VOCAB_MESSAGE.TERM_ALREADY_EXISTS,
      );

    const word = await AdminVocabularyRepository.createWord(data);

    return {
      message: ADD_VOCAB_MESSAGE.ADD_SUCCESS,
      data: word,
    };
  },

  async addBulkWords(data: AddBulkWordsDto) {
    const results = await AdminVocabularyRepository.createManyWords(
      data.words,
      data.wordSetId,
    );

    return {
      message: ADD_VOCAB_MESSAGE.BULK_ADD_SUCCESS,
      data: {
        totalSubmitted: data.words.length,
        totalSuccess: results.success.length,
        totalDuplicate: results.duplicates.length,
        totalError: results.errors.length,
        success: results.success,
        duplicates: results.duplicates,
        errors: results.errors,
      },
    };
  },

  async deleteWordSet(wordSetId: string) {
    try {
      await AdminVocabularyRepository.deleteWordSet(wordSetId);

      return { message: "Xóa bộ từ vựng thành công" };
    } catch (error) {
      const message = (error as Error).message;
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  },
};
