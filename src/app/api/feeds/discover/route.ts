import { NextResponse } from "next/server";

import { FeedCategory } from "@prisma/client";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { getRecommendedFeeds } from "@/lib/services/rss.service";

export const GET = async (req: Request) => {
  try {
    const session = await protectApiRoute();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as FeedCategory | null;

    const feeds = await getRecommendedFeeds(session.user.id, category);
    return NextResponse.json({ feeds });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error discovering feeds:", error);
    return NextResponse.json({ error: "Failed to discover feeds" }, { status: 500 });
  }
};
