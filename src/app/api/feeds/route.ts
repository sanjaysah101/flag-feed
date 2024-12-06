import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/utils";
import { RSSService } from "@/lib/services/rss.service";

export const GET = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const feeds = await RSSService.processFeeds(user.id);

    return NextResponse.json({ feeds });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching feeds:", error);
    return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 });
  }
};
