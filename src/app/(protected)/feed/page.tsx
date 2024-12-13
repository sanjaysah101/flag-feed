import { auth } from "@/auth";
import { RealtimeFeed } from "@/components/feeds/RealtimeFeed";
import { getFeedItems } from "@/lib/services/feed.service";

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user) return null;

  const feedItems = await getFeedItems(session.user.id);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Recent Articles</h2>
        <p className="text-muted-foreground">Stay updated with the latest content from your subscribed feeds</p>
      </div>
      <RealtimeFeed initialItems={feedItems} />
    </div>
  );
}
