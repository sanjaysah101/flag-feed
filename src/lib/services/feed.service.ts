import type { Feed, FeedCategory, FeedItem } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

type FeedItemWithFeed = FeedItem & { feed: Feed };

export const getFeedItems = async (userId: string): Promise<FeedItemWithFeed[]> => {
  return prisma.feedItem.findMany({
    where: { userId },
    orderBy: { pubDate: "desc" },
    include: { feed: true },
  });
};

export const markItemAsRead = async (itemId: string) => {
  return prisma.feedItem.update({
    where: { id: itemId },
    data: { isRead: true },
  });
};

export const getUserFeeds = async (userId: string) => {
  return prisma.feed.findMany({
    where: { addedBy: userId },
    include: {
      _count: {
        select: { items: true },
      },
    },
  });
};

export const getSubscribedCategories = async (userId: string): Promise<FeedCategory[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true,
    },
  });

  return user?.preferences?.subscribedCategories || [];
};

export const getFeedItem = async (id: string): Promise<FeedItem | null> => {
  return prisma.feedItem.findUnique({
    where: { id },
    include: { feed: true },
  });
};

export const getUserDashboardStats = async (userId: string) => {
  const [feedCount, readArticles, userStats] = await Promise.all([
    prisma.feed.count({
      where: { addedBy: userId },
    }),
    prisma.feedItem.count({
      where: {
        userId,
        isRead: true,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    }),
  ]);

  return {
    feedCount,
    readArticles,
    level: Math.floor((userStats?.points || 0) / 100) + 1,
    pointsToNextLevel: 100 - ((userStats?.points || 0) % 100),
  };
};
