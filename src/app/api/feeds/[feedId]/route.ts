import { NextRequest, NextResponse } from "next/server";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { deleteFeed, refreshFeed } from "@/lib/services/rss.service";

type Params = {
  feedId: string;
};

export const DELETE = async (_request: NextRequest, { params }: { params: Promise<Params> }): Promise<Response> => {
  const { feedId } = await params;
  const session = await protectApiRoute();

  if (session instanceof NextResponse) return session;

  if (!feedId) {
    return NextResponse.json({ error: "Feed ID is required" }, { status: 400 });
  }

  try {
    await deleteFeed(feedId, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return NextResponse.json({ error: "Failed to delete feed" }, { status: 500 });
  }
};

export const PUT = async (_request: NextRequest, { params }: { params: Promise<Params> }): Promise<Response> => {
  const { feedId } = await params;
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  try {
    const feed = await refreshFeed(feedId, session.user.id);
    return NextResponse.json({ feed });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return NextResponse.json({ error: "Failed to refresh feed" }, { status: 500 });
  }
};
