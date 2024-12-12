import { auth } from "@/auth";
import { RealtimeStats } from "@/components/dashboard/RealtimeStats";
import { RealtimeFeed } from "@/components/feeds/RealtimeFeed";
import { getFeedItems, getUserDashboardStats } from "@/lib/services/feed.service";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [feedItems, stats] = await Promise.all([getFeedItems(session.user.id), getUserDashboardStats(session.user.id)]);

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <RealtimeStats initialStats={stats} />
        </div>
        <RealtimeFeed initialItems={feedItems} />
      </div>
    </div>
  );
}
