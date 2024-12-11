import { NextResponse } from "next/server";

import { getCurrentStreak } from "@/lib/services/gamification.service";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const streak = await getCurrentStreak(userId);
    return NextResponse.json({ streak });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch streak" },
      { status: 500 }
    );
  }
};
