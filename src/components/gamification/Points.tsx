"use client";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Flame, Target, Trophy } from "lucide-react";

import { FLAGS } from "@/lib/devcycle/flags";

import { useGamification } from "../../hooks/useGamification";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { ProgressBar } from "./ProgressBar";

export const Points = () => {
  const { stats, isLoading } = useGamification();
  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);
  const hasStreaks = useVariableValue(FLAGS.GAMIFICATION.STREAKS, false);

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  const pointsToNext = stats.level * 100 - stats.points;

  return (
    <div className="space-y-6 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">Level {stats.level}</span>
        </div>
        <Badge variant="secondary" className="animate-in fade-in">
          {stats.points} XP
        </Badge>
      </div>

      <ProgressBar current={stats.points % 100} max={100} label={`${pointsToNext} XP to Level ${stats.level + 1}`} />

      <div className="grid grid-cols-2 gap-4">
        {hasStreaks && (
          <div className="flex items-center gap-2 rounded-lg border p-3 animate-in slide-in-from-left">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium">{stats.streak} Day Streak</p>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </div>
          </div>
        )}

        {hasPointBoost && (
          <div className="flex items-center gap-2 rounded-lg border p-3 animate-in slide-in-from-right">
            <Target className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">2x Points</p>
              <p className="text-xs text-muted-foreground">Boost Active</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
