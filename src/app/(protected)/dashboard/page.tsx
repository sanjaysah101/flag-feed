import Link from "next/link";

import { BookOpen, Compass, Newspaper, RssIcon, Target, TrendingUp, Trophy } from "lucide-react";

import { auth } from "@/auth";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { GamificationHub } from "@/components/gamification/GamificationHub";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FLAGS } from "@/lib/devcycle/flags";
import { getUserDashboardStats } from "@/lib/services/feed.service";

import { Badge } from "../../../components/ui";
import { getVariableValue } from "../../../lib/devcycle/config";

const quickActions = [
  {
    title: "Recent Articles",
    description: "View and manage your feed articles",
    icon: Newspaper,
    href: "/feed",
    color: "text-blue-500",
    featureFlag: FLAGS.FEED.REALTIME_UPDATES,
  },
  {
    title: "Manage Feeds",
    description: "Add or edit your RSS feed subscriptions",
    icon: RssIcon,
    href: "/feeds",
    color: "text-green-500",
  },
  {
    title: "Discover Content",
    description: "Find new feeds and content sources",
    icon: Compass,
    href: "/feeds/discover",
    color: "text-purple-500",
    featureFlag: FLAGS.FEED.AI_RECOMMENDATIONS,
  },
  {
    title: "Reading Progress",
    description: "Track your reading achievements",
    icon: BookOpen,
    href: "/reading-list",
    color: "text-orange-500",
    featureFlag: FLAGS.GAMIFICATION.ENABLED,
  },
  {
    title: "Achievements",
    description: "View your badges and rewards",
    icon: Trophy,
    href: "/gamification",
    color: "text-yellow-500",
    featureFlag: FLAGS.GAMIFICATION.ENABLED,
  },
  {
    title: "Analytics",
    description: "Insights into your reading habits",
    icon: TrendingUp,
    href: "/analytics",
    color: "text-indigo-500",
    featureFlag: FLAGS.ANALYTICS.ENABLED,
  },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const hasPointBoost = await getVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);

  const stats = await getUserDashboardStats(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name}!</h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your reading activity and quick actions.</p>
        </div>

        {hasPointBoost && (
          <Badge variant="secondary" className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            2x Points Active
          </Badge>
        )}
      </div>

      <DashboardCards stats={stats} />
      <GamificationHub />

      <div>
        <h2 className="mb-6 text-xl font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            return (
              <Card key={action.href} className="group transition-all hover:shadow-md">
                <Link href={action.href}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                      {action.title}
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      View {action.title}
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
