"use client";

import { useEffect, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Award, Flame, Trophy } from "lucide-react";

import { FLAGS } from "@/lib/devcycle/flags";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface PointsProps {
  userId: string;
  initialPoints: number;
}

export const Points = ({ userId, initialPoints }: PointsProps) => {
  const [points, setPoints] = useState(initialPoints);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);
  const hasStreaks = useVariableValue(FLAGS.GAMIFICATION.STREAKS, false);
  const hasAchievements = useVariableValue(FLAGS.GAMIFICATION.ACHIEVEMENTS, false);

  const calculateLevel = (pts: number) => Math.floor(pts / 100) + 1;
  const calculateProgress = (pts: number) => pts % 100;

  useEffect(() => {
    setLevel(calculateLevel(points));

    // Fetch current streak
    const fetchStreak = async () => {
      const response = await fetch(`/api/gamification/streak?userId=${userId}`);
      const data = await response.json();
      setStreak(data.streak);
    };

    if (hasStreaks) {
      fetchStreak();
    }
  }, [points, userId, hasStreaks]);

  // Listen for point updates
  useEffect(() => {
    const eventSource = new EventSource(`/api/gamification/points/stream?userId=${userId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPoints(data.points);
    };

    return () => eventSource.close();
  }, [userId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          Level {level}
          {hasAchievements && <Award className="h-4 w-4 text-yellow-500" />}
          {hasStreaks && streak > 0 && (
            <Badge variant="outline" className="ml-2">
              <Flame className="mr-1 h-3 w-3 text-orange-500" />
              {streak} day streak
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Trophy className={`h-4 w-4 ${hasPointBoost ? "text-purple-500" : ""}`} />
          <span className="font-bold">{points}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress
          value={calculateProgress(points)}
          className={`h-2 ${
            hasPointBoost ? "[&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500" : ""
          }`}
        />
        <p className="mt-2 text-xs text-muted-foreground">{100 - (points % 100)} points to next level</p>
      </CardContent>
    </Card>
  );
};
