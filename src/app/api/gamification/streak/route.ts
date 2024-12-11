import { NextResponse } from "next/server";

import { getCurrentStreak } from "@/lib/services/gamification.service";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const streak = await getCurrentStreak(userId);
  return NextResponse.json({ streak });
};
