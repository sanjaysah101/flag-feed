import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getUserStats } from "@/lib/services/gamification.service";

export const GET = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getUserStats(session.user.id);
    return NextResponse.json(stats);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch gamification stats" }, { status: 500 });
  }
};
