import { Suspense } from "react";

import { AddFeedForm } from "@/components/feeds/AddFeedForm";
import { FeedList } from "@/components/feeds/FeedList";
import { protectPage } from "@/lib/auth/protect";

export default async function FeedsPage() {
  await protectPage();

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Tech Feeds</h1>
      <div className="mb-8">
        <AddFeedForm />
      </div>
      <Suspense fallback={<div>Loading feeds from server...</div>}>
        <FeedList />
      </Suspense>
    </div>
  );
}
