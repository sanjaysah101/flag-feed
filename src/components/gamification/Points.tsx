"use client";

import { useEffect, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Award, Flame, Target, Trophy } from "lucide-react";

import { FLAGS } from "@/lib/devcycle/flags";

import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface PointsProps {
  userId: string;
  initialPoints: number;
}

export const Points = ({ userId, initialPoints }: PointsProps) => {
  const [points, setPoints] = useState(initialPoints);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);

  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);
  const hasStreaks = useVariableValue(FLAGS.GAMIFICATION.STREAKS, false);
  const hasAchievements = useVariableValue(FLAGS.GAMIFICATION.ACHIEVEMENTS, false);

  const calculateLevel = (pts: number) => Math.floor(pts / 100) + 1;
  const calculateProgress = (pts: number) => pts % 100;

  useEffect(() => {
    setLevel(calculateLevel(points));
    setProgress(calculateProgress(points));

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
      if (data.points) setPoints(data.points);
    };

    return () => eventSource.close();
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Level {level}</span>
          </div>
          <span className="text-sm text-muted-foreground">{points} XP Total</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {100 - progress} XP to Level {level + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {hasStreaks && (
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium">{streak} Day Streak</p>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </div>
          </div>
        )}

        {hasPointBoost && (
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Target className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">2x Points Active</p>
              <p className="text-xs text-muted-foreground">Point boost enabled</p>
            </div>
          </div>
        )}
      </div>

      {/* Point Milestones */}
      {hasAchievements && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium">Next Milestone</span>
          </div>
          <div className="flex gap-2">
            {points < 100 && <Badge variant="outline">{100 - points} XP to Century Club</Badge>}
            {points >= 100 && points < 500 && <Badge variant="outline">{500 - points} XP to Master Reader</Badge>}
          </div>
        </div>
      )}
    </div>
  );
};
