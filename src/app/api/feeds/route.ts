import { NextResponse } from "next/server";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { RSSService } from "@/lib/services/rss.service";

export const GET = async () => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  try {
    const feeds = await RSSService.processFeeds(session.user.id);
    return NextResponse.json({ feeds });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching feeds:", error);
    return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 });
  }
};
