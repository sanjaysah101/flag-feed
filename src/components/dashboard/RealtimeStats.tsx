"use client";

import { BookOpenIcon, RssIcon, TrophyIcon } from "lucide-react";

import { useGamificationContext } from "../../providers/GamificationProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface RealtimeStatsProps {
  initialStats: {
    feedCount: number;
    readArticles: number;
    level: number;
    pointsToNextLevel: number;
  };
}

export const RealtimeStats = ({ initialStats }: RealtimeStatsProps) => {
  const { stats } = useGamificationContext();
  const pointsToNextLevel = 100 - (stats.points % 100);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Feeds</CardTitle>
          <RssIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{initialStats.feedCount}</div>
          <p className="text-xs text-muted-foreground">Active RSS feeds</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
          <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.articlesRead || initialStats.readArticles}</div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Current Level</CardTitle>
          <TrophyIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.level || initialStats.level}</div>
          <p className="text-xs text-muted-foreground">
            {pointsToNextLevel || initialStats.pointsToNextLevel} XP to next level
          </p>
        </CardContent>
      </Card>
    </>
  );
};
