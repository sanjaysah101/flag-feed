import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { GamificationAction } from "@/hooks/useGamification";
import { awardPoints, trackReadingStreak } from "@/lib/services/gamification.service";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = (await req.json()) as { action: GamificationAction };
    const userId = session.user.id;

    let points = 0;
    let streak = 0;

    // Process the action
    switch (action) {
      case "READ_ARTICLE":
        points = await awardPoints(userId, "READ_ARTICLE");
        streak = (await trackReadingStreak(userId)) || 0;
        break;
      case "SHARE_ARTICLE":
        points = await awardPoints(userId, "SHARE_ARTICLE");
        break;
      case "DAILY_CHALLENGE":
        points = await awardPoints(userId, "DAILY_CHALLENGE");
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ points, streak });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Gamification event error:", error);
    return NextResponse.json({ error: "Failed to process gamification event" }, { status: 500 });
  }
};
