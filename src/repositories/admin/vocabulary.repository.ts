import { randomUUID } from "node:crypto";
import { prisma } from "../../config/prisma";
import { AddWordDto, UpdateWordSetDto } from "../../schemas/vocabulary.schema";

export const AdminVocabularyRepository = {
  getVocabsByWordSetId(wordsetId: string) {
    return prisma.words.findMany({
      where: { word_set_words: { some: { word_set_id: wordsetId } } },
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
        CreatedAt: true,
        UpdatedAt: true,
      },
    });
  },
  //Check existed word term
  findByTerm: async (term: string) => {
    return prisma.words.findUnique({ where: { Term: term } });
  },

  //Add 1 word
  createWord: async (data: AddWordDto) => {
    return prisma.$transaction(async (tx) => {
      const wordId = randomUUID();
      const word = await tx.words.create({
        data: {
          Id: wordId,
          Term: data.term,
          Phonetic: data.phonetic,
          AudioUrl: data.audioUrl,
          Topic: data.topic,
          Level: data.level,
          WordForm: data.wordForm,
          CreatedAt: new Date(),
        },
      });

      await tx.word_definitions.createMany({
        data: data.definitions.map((def, index) => ({
          Id: randomUUID(),
          WordId: word.Id,
          PartOfSpeech: def.partOfSpeech,
          DefinitionEn: def.definitionEn,
          DefinitionVi: def.definitionVi,
          ExampleEn: def.exampleEn,
          ExampleVi: def.exampleVi,
          Tips: def.tips,
          SortOrder: def.sortOrder ?? index,
          CreatedAt: new Date(),
        })),
      });

      if (data.wordSetIds?.length) {
        await tx.word_set_words.createMany({
          data: data.wordSetIds.map((setId, index) => ({
            word_set_id: setId,
            word_id: word.Id,
            order_index: index,
          })),
          skipDuplicates: true,
        });

        await Promise.all(
          data.wordSetIds.map((setId) =>
            tx.word_sets.update({
              where: { id: setId },
              data: { total_words: { increment: 1 } },
            }),
          ),
        );
      }

      return word;
    });
  },

  //Add many words at a time
  createManyWords: async (words: AddWordDto[], wordSetId?: string) => {
    const results = {
      success: [] as string[],
      duplicates: [] as string[],
      errors: [] as { term: string; error: string }[],
    };

    for (const wordData of words) {
      try {
        const existing = await prisma.words.findUnique({
          where: { Term: wordData.term },
        });

        if (existing) {
          results.duplicates.push(wordData.term);
          continue;
        }

        const data = wordSetId
          ? { ...wordData, wordSetId: [wordSetId] }
          : wordData;

        const created = await AdminVocabularyRepository.createWord(data);

        results.success.push(created.Term);
      } catch (error) {
        results.errors.push({
          term: wordData.term,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    return results;
  },

  //Update word set
  updateWordSet: async (data: UpdateWordSetDto) => {},

  //Delete word set
  deleteWordSet: async (wordSetId: string) => {
    try {
      const result = await prisma.word_sets.updateMany({
        where: { id: wordSetId, total_words: 0 },
        data: {
          isActive: false,
        },
      });

      if (result.count === 0) {
        throw new Error(
          "Không thể xóa: Word set không tồn tại hoặc đã chứa từ vựng.",
        );
      }
    } catch (error) {
      throw error;
    }
  },
};
