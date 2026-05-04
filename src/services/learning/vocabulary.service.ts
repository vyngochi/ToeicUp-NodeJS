import { prisma } from "../../config/prisma";
import { VOCABULARY_MESSAGE } from "../../constants/messages/vocab.message";
import { pagination } from "../../libs/paginationHelper";

export const VocabularyServices = {
  //get word set
  async getListWordSet(searchKey: string, pageSize: number, pageIndex: number) {
    const limit = pageSize || 10;
    const page = pageIndex || 1;
    const skipValue = (page - 1) * limit;
    const whereCondition = searchKey
      ? { name: { contains: searchKey, mode: "insensitive" as const } }
      : {};

    const [wordSets, total] = await Promise.all([
      prisma.word_sets.findMany({
        where: whereCondition,
        skip: skipValue,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          level: true,
          thumbnail: true,
          total_words: true,
          topics: {
            select: {
              id: true,
              name: true,
              description: true,
              thumbnail: true,
            },
          },
        },
      }),

      prisma.word_sets.count({ where: whereCondition }),
    ]);

    if (wordSets.length === 0)
      return { message: VOCABULARY_MESSAGE.NOT_WORD_SETS };

    return {
      message: VOCABULARY_MESSAGE.GET_SUCCESS,
      data: {
        wordSets,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async getWordSetsWithTopics(
    searchKey: string,
    pageSize: number,
    pageIndex: number,
  ) {
    const { limit, page, skipValues } = pagination(pageSize, pageIndex);

    const whereCondition = searchKey
      ? { name: { contains: searchKey, mode: "insensitive" as const } }
      : {};

    const [topics, total] = await Promise.all([
      prisma.topics.findMany({
        // where: whereCondition,
        skip: skipValues,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          thumbnail: true,
          total_words: true,
          word_sets: {
            where: whereCondition,
            select: {
              id: true,
              name: true,
              description: true,
              level: true,
              total_words: true,
            },
          },
        },
      }),

      prisma.word_sets.count({ where: whereCondition }),
    ]);

    if (topics.length === 0)
      return { message: VOCABULARY_MESSAGE.NOT_WORD_SETS };

    return {
      message: VOCABULARY_MESSAGE.GET_SUCCESS,
      data: {
        topics,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },
};
