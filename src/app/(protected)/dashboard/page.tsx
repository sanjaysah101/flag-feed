import Link from "next/link";
import { Suspense } from "react";

import { BookOpenIcon, RssIcon, TrophyIcon } from "lucide-react";

import { auth } from "@/auth";
import { StatsCardSkeleton } from "@/components/dashboard/StatsCardSkeleton";
import { RealtimeFeed } from "@/components/feeds/RealtimeFeed";
import { Achievements } from "@/components/gamification/AchievementsServer";
import { UserStats } from "@/components/gamification/UserStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

// Add this function to fetch user stats
const getUserDashboardStats = async (userId: string) => {
  const [feedCount, readArticles, userStats] = await Promise.all([
    // Get total feeds count
    prisma.feed.count({
      where: { userId },
    }),
    // Get articles read in last 30 days
    prisma.feedItem.count({
      where: {
        userId,
        isRead: true,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    // Get user points/level
    prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    }),
  ]);

  // Calculate level based on points (example: 100 points per level)
  const level = Math.floor((userStats?.points || 0) / 100) + 1;
  const pointsToNextLevel = 100 - ((userStats?.points || 0) % 100);

  return {
    feedCount,
    readArticles,
    level,
    pointsToNextLevel,
  };
};

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Fetch real stats
  const stats = await getUserDashboardStats(session.user.id);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name}!</h1>
        <p className="text-muted-foreground">Track your learning progress and manage your RSS feeds</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <div className="grid gap-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<StatsCardSkeleton />}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Feeds</CardTitle>
                  <RssIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.feedCount}</div>
                  <p className="text-xs text-muted-foreground">Active RSS feeds</p>
                </CardContent>
              </Card>
            </Suspense>
            <Suspense fallback={<StatsCardSkeleton />}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
                  <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.readArticles}</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </Suspense>
            <Suspense fallback={<StatsCardSkeleton />}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Level</CardTitle>
                  <TrophyIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.level}</div>
                  <p className="text-xs text-muted-foreground">{stats.pointsToNextLevel} XP to next level</p>
                </CardContent>
              </Card>
            </Suspense>
          </div>

          {/* Feed Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Feed Items</CardTitle>
                <CardDescription>Your latest unread articles</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/feeds">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RealtimeFeed userId={session.user.id} />
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your achievements and stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UserStats userId={session.user.id} />
              <Achievements userId={session.user.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
