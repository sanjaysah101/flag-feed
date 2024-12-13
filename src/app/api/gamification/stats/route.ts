import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export const GET = async () => {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [userStats, readArticles, feedCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { points: true, streak: true },
      }),
      prisma.feedItem.count({
        where: { userId: session.user.id, isRead: true },
      }),
      prisma.feed.count({
        where: { addedBy: session.user.id },
      }),
    ]);

    const points = userStats?.points || 0;
    const level = Math.floor(points / 100) + 1;

    return NextResponse.json({
      points,
      level,
      streak: userStats?.streak || 0,
      pointsToNextLevel: 100 - (points % 100),
      readArticles,
      feedCount,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch gamification stats:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
