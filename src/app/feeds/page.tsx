import { Suspense } from "react";

import { AddFeedForm } from "@/components/feeds/AddFeedForm";
import { FeedList } from "@/components/feeds/FeedList";
import { protectPage } from "@/lib/auth/protect";
import { processFeeds } from "@/lib/services/rss.service";
import type { RSSFeed } from "@/types/rss";

export default async function FeedsPage() {
  const session = await protectPage();
  const feeds = await processFeeds(session.user.id);

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Tech Feeds</h1>
      <div className="mb-8">
        <AddFeedForm />
      </div>
      <Suspense fallback={<div>Loading feeds from server...</div>}>
        <FeedList feeds={feeds as unknown as RSSFeed[]} />
      </Suspense>
    </div>
  );
}
