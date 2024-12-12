import { prisma } from "@/lib/db/prisma";
import { FLAGS } from "@/lib/devcycle/flags";

import { getVariableValue } from "../devcycle/config";

export const POINTS = {
  READ_ARTICLE: 5,
  COMPLETE_QUIZ: 10,
  DAILY_STREAK: 15,
  SHARE_ARTICLE: 3,
  DAILY_CHALLENGE: 20,
} as const;

export const ACHIEVEMENTS = {
  CENTURY_CLUB: {
    type: "points",
    title: "Century Club",
    requirement: 100,
  },
  AVID_READER: {
    type: "reading",
    title: "Avid Reader",
    requirement: 10,
  },
  STREAK_MASTER: {
    type: "streak",
    title: "Streak Master",
    requirement: 7,
  },
  SOCIAL_BUTTERFLY: {
    type: "sharing",
    title: "Social Butterfly",
    requirement: 5,
  },
} as const;

export const awardPoints = async (userId: string, action: keyof typeof POINTS) => {
  const hasPointBoost = await getVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);
  const pointValue = POINTS[action] * (hasPointBoost ? 2 : 1);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      points: { increment: pointValue },
    },
    select: {
      points: true,
    },
  });

  // Check for point-based achievements
  await checkPointAchievements(userId, user.points);

  return user.points;
};

const checkPointAchievements = async (userId: string, points: number) => {
  if (points >= ACHIEVEMENTS.CENTURY_CLUB.requirement) {
    await prisma.userAchievement.upsert({
      where: {
        userId_type: {
          userId,
          type: ACHIEVEMENTS.CENTURY_CLUB.type,
        },
      },
      create: {
        userId,
        type: ACHIEVEMENTS.CENTURY_CLUB.type,
        title: ACHIEVEMENTS.CENTURY_CLUB.title,
      },
      update: {},
    });
  }
};

export const trackReadingStreak = async (userId: string) => {
  const hasStreaks = await getVariableValue(FLAGS.GAMIFICATION.STREAKS, false);
  if (!hasStreaks) return null;

  const today = new Date();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastRead: true, streak: true },
  });

  const lastRead = user?.lastRead;
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  let newStreak = user?.streak || 0;

  if (lastRead?.toDateString() === yesterdayDate.toDateString()) {
    newStreak += 1;
    await awardPoints(userId, "DAILY_STREAK");
  } else if (lastRead?.toDateString() !== today.toDateString()) {
    newStreak = 1;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      lastRead: today,
      streak: newStreak,
    },
  });

  // Check for streak achievements
  if (newStreak >= ACHIEVEMENTS.STREAK_MASTER.requirement) {
    await prisma.userAchievement.upsert({
      where: {
        userId_type: {
          userId,
          type: ACHIEVEMENTS.STREAK_MASTER.type,
        },
      },
      create: {
        userId,
        type: ACHIEVEMENTS.STREAK_MASTER.type,
        title: ACHIEVEMENTS.STREAK_MASTER.title,
      },
      update: {},
    });
  }

  return newStreak;
};

export const getUserStats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: true,
      feedItems: {
        where: { isRead: true },
      },
    },
  });

  return {
    points: user?.points || 0,
    streak: user?.streak || 0,
    articlesRead: user?.feedItems.length || 0,
    achievements:
      user?.achievements.map((a) => ({
        id: a.id,
        type: a.type,
        title: a.title,
        awardedAt: a.awardedAt.toISOString(),
      })) || [],
    level: Math.floor((user?.points || 0) / 100) + 1,
  };
};

export const trackArticleRead = async (userId: string, articleId: string) => {
  // Track the read article
  await prisma.feedItem.update({
    where: { id: articleId },
    data: { isRead: true },
  });

  // Award points and update streak
  const points = await awardPoints(userId, "READ_ARTICLE");
  const streak = await trackReadingStreak(userId);

  // Check for reading achievements
  const readCount = await prisma.feedItem.count({
    where: { userId, isRead: true },
  });

  if (readCount >= ACHIEVEMENTS.AVID_READER.requirement) {
    await prisma.userAchievement.upsert({
      where: {
        userId_type: {
          userId,
          type: ACHIEVEMENTS.AVID_READER.type,
        },
      },
      create: {
        userId,
        type: ACHIEVEMENTS.AVID_READER.type,
        title: ACHIEVEMENTS.AVID_READER.title,
      },
      update: {},
    });
  }

  return { points, streak };
};

export const getCurrentStreak = async (userId: string): Promise<number> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true },
  });

  return user?.streak || 0;
};
