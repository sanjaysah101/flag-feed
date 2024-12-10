import { NextResponse } from "next/server";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { deleteFeed, refreshFeed } from "@/lib/services/rss.service";

export const DELETE = async (_request: Request, { params }: { params: { feedId: string } }) => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  try {
    await deleteFeed(params.feedId, session.user.id);
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete feed" }, { status: 500 });
  }
};

export const PUT = async (_request: Request, { params }: { params: { feedId: string } }) => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  try {
    const feed = await refreshFeed(params.feedId, session.user.id);
    return NextResponse.json({ feed });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to refresh feed" }, { status: 500 });
  }
};
