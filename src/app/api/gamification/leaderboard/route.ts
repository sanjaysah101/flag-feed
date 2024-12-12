import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export const GET = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        points: true,
      },
      orderBy: {
        points: "desc",
      },
      take: 10,
    });

    const leaderboard = users.map((user, index) => ({
      userId: user.id,
      name: user.name || "Anonymous",
      image: user.image,
      points: user.points,
      rank: index + 1,
      level: Math.floor(user.points / 100) + 1,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
};
