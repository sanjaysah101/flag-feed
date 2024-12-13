import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { GAMIFICATION_ACTIONS } from "@/providers/GamificationProvider";

const POINTS_MAP = {
  [GAMIFICATION_ACTIONS.READ_ARTICLE]: 10,
  [GAMIFICATION_ACTIONS.SHARE_ARTICLE]: 15,
  [GAMIFICATION_ACTIONS.DAILY_CHALLENGE]: 25,
  [GAMIFICATION_ACTIONS.ADD_FEED]: 20,
};

export const POST = async (request: Request) => {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { action } = await request.json();
    const points = POINTS_MAP[action as keyof typeof POINTS_MAP] || 0;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: { increment: points },
        streak: { increment: action === GAMIFICATION_ACTIONS.READ_ARTICLE ? 1 : 0 },
      },
      select: {
        points: true,
        streak: true,
      },
    });

    return NextResponse.json({ points, streak: user.streak });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to process gamification action:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
