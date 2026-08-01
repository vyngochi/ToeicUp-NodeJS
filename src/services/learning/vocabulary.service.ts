import { prisma } from "../../config/prisma";
import { HttpStatus } from "../../constants/enums/status-code";
import { VOCABULARY_MESSAGE } from "../../constants/messages/vocab.message";
import { pagination } from "../../libs/paginationHelper";
import { AppError } from "../../middlewares/error-handler";
import { VocabularyRepository } from "../../repositories/vocabulary.repository";

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
          created_at: true,
          updated_at: true,
          isActive: true,
        },
      }),

      prisma.word_sets.count({ where: whereCondition }),
    ]);

    if (wordSets.length === 0)
      return { message: VOCABULARY_MESSAGE.NOT_WORD_SETS };

    const wordSetResponse = wordSets.filter(
      (word_set) => word_set.isActive === true,
    );

    return {
      message: VOCABULARY_MESSAGE.GET_SUCCESS,
      data: {
        wordSets: wordSetResponse,
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

  async getDashboardWordSets(userId: string) {
    const dueTodayWords = await prisma.user_word_progresses.findMany({
      where: {
        UserId: userId,
        NextReviewAt: { lte: new Date() },
      },
      select: { WordId: true },
    });
    
    const dueWordIds = dueTodayWords.map((w) => w.WordId);

    const dueTodayTopics = await prisma.topics.findMany({
      where: {
        word_sets: {
          some: {
            word_set_words: {
              some: {
                word_id: { in: dueWordIds },
              },
            },
            isActive: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        total_words: true,
        word_sets: {
          where: {
            word_set_words: {
              some: {
                word_id: { in: dueWordIds },
              },
            },
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            total_words: true,
            thumbnail: true,
          },
        },
      },
    });

    const recentWords = await prisma.user_word_progresses.findMany({
      where: {
        UserId: userId,
        LastSeenAt: { not: null },
      },
      orderBy: { LastSeenAt: "desc" },
      take: 100,
      select: { WordId: true },
    });
    const recentWordIds = recentWords.map((w) => w.WordId);

    const recentlyLearnedTopics = await prisma.topics.findMany({
      where: {
        word_sets: {
          some: {
            word_set_words: {
              some: {
                word_id: { in: recentWordIds },
              },
            },
            isActive: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        total_words: true,
        word_sets: {
          where: {
            word_set_words: {
              some: {
                word_id: { in: recentWordIds },
              },
            },
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            total_words: true,
            thumbnail: true,
          },
        },
      },
    });

    return {
      message: "Get dashboard word sets successfully",
      data: {
        dueTodayTopics,
        recentlyLearnedTopics,
      },
    };
  },

  async getListVocabByWordSetIdForLeaner(
    wordSetId: string,
    pageSize: number,
    pageIndex: number,
  ) {
    console.log(pageSize);

    const { limit, page, skipValues } = pagination(pageSize, pageIndex);
    if (wordSetId === null) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        VOCABULARY_MESSAGE.GET_VOCAB.NO_WORD_SET_ID,
      );
    }

    console.log(limit);

    const [data, total] = await Promise.all([
      VocabularyRepository.getVocabsByWordSetIdForLearner(
        wordSetId,
        limit,
        skipValues,
      ),
      VocabularyRepository.countVocabsByWordSetId(wordSetId),
    ]);

    return {
      message: VOCABULARY_MESSAGE.GET_VOCAB.RESPONSE.SUCCESS,
      data: {
        vocabs: data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / pageSize) || 0,
      }
    };
  },
};
