import { prisma } from "../config/prisma";

export const VocabularyRepository = {
  //Get list words by word set id
  getVocabsByWordSetIdForLearner(
    wordsetId: string,
    limit: number,
    skipValues: number,
  ) {
    return prisma.words.findMany({
      where: { word_set_words: { some: { word_set_id: wordsetId } } },
      skip: skipValues,
      take: limit,
      select: {
        Id: true,
        Term: true,
        Level: true,
        WordForm: true,
        word_definitions: {
          select: {
            Id: true,
            DefinitionVi: true,
            DefinitionEn: true,
          },
        },
        Phonetic: true,
        Topic: true,
        AudioUrl: true,
      },
    });
  },

  async countVocabsByWordSetId(wordSetId: string) {
    return await prisma.words.count({
      where: {
        word_set_words: {
          some: { word_set_id: wordSetId },
        },
      },
    });
  },
};
