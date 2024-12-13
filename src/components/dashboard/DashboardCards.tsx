import Link from "next/link";

import { BookOpen, RssIcon, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardsProps {
  stats: {
    feedCount: number;
    readArticles: number;
    level: number;
    pointsToNextLevel: number;
  };
}

export const DashboardCards = ({ stats }: DashboardCardsProps) => {
  const cards = [
    {
      title: "Active Feeds",
      value: stats.feedCount,
      description: "Subscribed RSS feeds",
      icon: RssIcon,
      href: "/feeds",
    },
    {
      title: "Articles Read",
      value: stats.readArticles,
      description: "Articles completed",
      icon: BookOpen,
      href: "/reading-list",
    },
    {
      title: "Level",
      value: stats.level,
      description: `${stats.pointsToNextLevel} points to next level`,
      icon: Trophy,
      href: "/achievements",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="transition-colors hover:bg-muted/50">
          <Link href={card.href}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};
