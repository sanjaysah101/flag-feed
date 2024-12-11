import { prisma } from "@/lib/db/prisma";
import { FLAGS } from "@/lib/devcycle/flags";
import type { Achievement } from "@/types/gamification";

import { getVariableValue } from "../devcycle/config";

export const POINTS = {
  READ_ARTICLE: 5,
  COMPLETE_QUIZ: 10,
  DAILY_STREAK: 15,
  SHARE_ARTICLE: 3,
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

  return user.points;
};

export const trackReadingStreak = async (userId: string) => {
  const hasStreaks = await getVariableValue(FLAGS.GAMIFICATION.STREAKS, false);
  if (!hasStreaks) return null;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastRead = await prisma.feedItem.findFirst({
    where: {
      userId,
      isRead: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });

  if (lastRead?.createdAt.toDateString() === yesterday.toDateString()) {
    await awardPoints(userId, "DAILY_STREAK");
    return true;
  }

  return false;
};

export const getCurrentStreak = async (userId: string) => {
  const hasStreaks = await getVariableValue(FLAGS.GAMIFICATION.STREAKS, false);
  if (!hasStreaks) return 0;

  const recentReads = await prisma.feedItem.findMany({
    where: {
      userId,
      isRead: true,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });

  let streak = 0;
  const today = new Date().toDateString();

  for (let i = 0; i < recentReads.length; i++) {
    const readDate = recentReads[i].createdAt.toDateString();
    if (i === 0 && readDate === today) continue;
    if (streak === 0 || readDate === new Date(Date.now() - streak * 24 * 60 * 60 * 1000).toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const getUserStats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      feedItems: {
        where: { isRead: true },
      },
    },
  });

  // Add default achievements based on stats
  const achievements = [
    (user?.points || 0) >= 100 && { id: "1", title: "Century Club", type: "points", awardedAt: new Date() },
    (user?.feedItems?.length || 0) >= 10 && { id: "2", title: "Avid Reader", type: "reading", awardedAt: new Date() },
  ].filter(Boolean) as Achievement[];

  return {
    points: user?.points || 0,
    articlesRead: user?.feedItems.length || 0,
    achievements,
  };
};
