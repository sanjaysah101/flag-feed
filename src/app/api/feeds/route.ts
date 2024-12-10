import { NextResponse } from "next/server";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { addFeed, processFeeds } from "@/lib/services/rss.service";

export const GET = async () => {
  try {
    const session = await protectApiRoute();
    if (session instanceof NextResponse) return session;

    const feeds = await processFeeds(session.user.id);
    return NextResponse.json({ feeds });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in GET /api/feeds:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  try {
    const { url, category } = await request.json();

    if (!url || !category) {
      return NextResponse.json({ error: "URL and category are required" }, { status: 400 });
    }

    const feed = await addFeed(session.user.id, url, category);
    return NextResponse.json({ feed });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error adding feed:", error);
    return NextResponse.json({ error: "Failed to add feed" }, { status: 500 });
  }
};
