import { prisma } from "../../config/prisma";
import { v4 as uuidv4 } from "uuid";

export const SRSServices = {
  /**
   * Calculate next review parameters using SuperMemo-2 (SM-2) algorithm
   * quality: 0-5
   *   0: Complete blackout
   *   1: Incorrect, but remembered upon seeing answer
   *   2: Incorrect, but seemed easy to recall
   *   3: Correct, but difficult to recall
   *   4: Correct, hesitated
   *   5: Perfect response
   */
  calculateSM2(
    quality: number,
    repetitions: number,
    previousInterval: number,
    previousEaseFactor: number,
  ) {
    let interval: number;
    let easeFactor = previousEaseFactor;
    let correctCount = repetitions;

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(previousInterval * previousEaseFactor);
      }
      correctCount += 1;
    } else {
      correctCount = 0;
      interval = 1;
    }

    // Update Ease Factor (EF)
    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    return {
      intervalDays: interval,
      easeFactor,
      correctCount,
    };
  },

  async submitReview(userId: string, wordId: string, quality: number) {
    if (quality < 0 || quality > 5) {
      throw new Error("Quality must be between 0 and 5");
    }

    // Check existing progress
    const existingProgress = await prisma.user_word_progresses.findUnique({
      where: {
        UserId_WordId: {
          UserId: userId,
          WordId: wordId,
        },
      },
    });

    // Handle Streak Calculation
    const user = await prisma.users.findUnique({
      where: { Id: userId },
      select: { LastStudyDate: true, Streak: true }
    });

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = user?.Streak || 0;

    if (user?.LastStudyDate) {
      const lastStudy = new Date(user.LastStudyDate);
      lastStudy.setHours(0, 0, 0, 0);

      if (lastStudy.getTime() === yesterday.getTime()) {
        newStreak += 1;
      } else if (lastStudy.getTime() < yesterday.getTime()) {
        newStreak = 1;
      }
      // if today, it stays the same
    } else {
      newStreak = 1;
    }


    
    let currentRepetitions = 0;
    let currentInterval = 1;
    let currentEaseFactor = 2.5; // Default EF
    let incorrectCount = 0;

    if (existingProgress) {
      currentRepetitions = existingProgress.CorrectCount;
      currentInterval = existingProgress.IntervalDays;
      currentEaseFactor = existingProgress.EaseFactor;
      incorrectCount = existingProgress.IncorrectCount;
    }

    if (quality < 3) {
      incorrectCount += 1;
    }

    const { intervalDays, easeFactor, correctCount } = this.calculateSM2(
      quality,
      currentRepetitions,
      currentInterval,
      currentEaseFactor,
    );

    const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
    const status = intervalDays > 21 ? "Mastered" : quality >= 3 ? "Reviewing" : "Learning";

    const updatedProgress = await prisma.user_word_progresses.upsert({
      where: {
        UserId_WordId: {
          UserId: userId,
          WordId: wordId,
        },
      },
      update: {
        Status: status,
        EaseFactor: easeFactor,
        IntervalDays: intervalDays,
        NextReviewAt: nextReviewAt,
        CorrectCount: correctCount,
        IncorrectCount: incorrectCount,
        LastSeenAt: now,
        UpdatedAt: now,
      },
      create: {
        Id: uuidv4(),
        UserId: userId,
        WordId: wordId,
        Status: status,
        EaseFactor: easeFactor,
        IntervalDays: intervalDays,
        NextReviewAt: nextReviewAt,
        CorrectCount: correctCount,
        IncorrectCount: incorrectCount,
        LastSeenAt: now,
        CreatedAt: now,
      },
    });

    // Update user streak and last study date
    await prisma.users.update({
      where: { Id: userId },
      data: {
        Streak: newStreak,
        LastStudyDate: now
      }
    });

    // Optionally update study_sessions or wordsReviewed count here
    // For now we just return the progress
    return updatedProgress;
  },

  async getDailyReviewWords(userId: string, wordSetId?: string, limit: number = 20) {
    const now = new Date();

    // 1. Get due for review (NextReviewAt <= now)
    const reviewWords = await prisma.user_word_progresses.findMany({
      where: {
        UserId: userId,
        NextReviewAt: {
          lte: now,
        },
        ...(wordSetId && {
          words: {
            word_set_words: {
              some: {
                word_set_id: wordSetId
              }
            }
          }
        })
      },
      include: {
        words: {
          include: {
            word_definitions: true,
          },
        },
      },
      take: limit,
      orderBy: {
        NextReviewAt: 'asc',
      },
    });

    const reviewCount = reviewWords.length;
    let newWords: any[] = [];

    // 2. If we need more words to reach the limit, fetch new ones
    if (reviewCount < limit) {
      const newWordsLimit = limit - reviewCount;
      newWords = await prisma.words.findMany({
        where: {
          user_word_progresses: {
            none: {
              UserId: userId,
            },
          },
          ...(wordSetId && {
            word_set_words: {
              some: {
                word_set_id: wordSetId
              }
            }
          })
        },
        include: {
          word_definitions: true,
        },
        take: newWordsLimit,
        orderBy: {
          CreatedAt: 'asc', // Or random, but Prisma lacks easy random
        },
      });
    }

    // Format response uniformly
    const formattedReview = reviewWords.map((uw) => ({
      ...uw.words,
      srs: {
        status: uw.Status,
        easeFactor: uw.EaseFactor,
        intervalDays: uw.IntervalDays,
        nextReviewAt: uw.NextReviewAt,
        correctCount: uw.CorrectCount,
      },
    }));

    const formattedNew = newWords.map((w) => ({
      ...w,
      srs: null, // Indicates completely new word
    }));

    return {
      totalDue: reviewCount,
      newAdded: formattedNew.length,
      words: [...formattedReview, ...formattedNew],
    };
  },

  async getStats(userId: string) {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. dueToday
    const dueToday = await prisma.user_word_progresses.count({
      where: {
        UserId: userId,
        NextReviewAt: {
          lte: endOfToday,
        },
      },
    });

    // 2. totalLearned
    const totalLearned = await prisma.user_word_progresses.count({
      where: {
        UserId: userId,
      },
    });

    // 3. accuracy
    const progresses = await prisma.user_word_progresses.findMany({
      where: {
        UserId: userId,
      },
      select: {
        CorrectCount: true,
        IncorrectCount: true,
      },
    });

    let totalCorrect = 0;
    let totalIncorrect = 0;
    for (const p of progresses) {
      totalCorrect += p.CorrectCount;
      totalIncorrect += p.IncorrectCount;
    }

    let accuracy = 0;
    if (totalCorrect + totalIncorrect > 0) {
      accuracy = Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100);
    }

    const user = await prisma.users.findUnique({
      where: {
        Id: userId,
      },
      select: {
        Streak: true,
      },
    });

    // 5. Monthly and Yearly aggregation
    const userProgressDates = await prisma.user_word_progresses.findMany({
      where: { UserId: userId },
      select: { CreatedAt: true },
    });

    const currentYear = new Date().getFullYear();
    const months = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'];
    
    const monthlyDataMap: Record<number, number> = {};
    for (let i = 0; i < 12; i++) {
      monthlyDataMap[i] = 0;
    }

    const yearlyDataMap: Record<number, number> = {};
    for (let i = 0; i < 5; i++) {
      yearlyDataMap[currentYear - 4 + i] = 0;
    }

    userProgressDates.forEach((p) => {
      const year = p.CreatedAt.getFullYear();
      const month = p.CreatedAt.getMonth();

      if (year === currentYear) {
        monthlyDataMap[month]++;
      }
      
      if (year >= currentYear - 4 && year <= currentYear) {
        yearlyDataMap[year]++;
      }
    });

    const monthlyData = Object.keys(monthlyDataMap).map((m) => ({
      name: months[parseInt(m)],
      learned: monthlyDataMap[parseInt(m)]
    }));

    const yearlyData = Object.keys(yearlyDataMap).map((y) => ({
      name: y.toString(),
      learned: yearlyDataMap[parseInt(y)]
    }));

    return {
      dueToday,
      accuracy,
      totalLearned,
      streak: user?.Streak || 0,
      monthlyData,
      yearlyData,
    };
  },
};
