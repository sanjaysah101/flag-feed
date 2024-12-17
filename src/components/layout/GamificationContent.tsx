"use client";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Flame, Target, Trophy } from "lucide-react";

import { Badge } from "@/components/ui";
import { useGamification } from "@/hooks";
import { FLAGS } from "@/lib/devcycle/flags";
import { cn } from "@/lib/utils";

interface GamificationContentProps {
  direction?: "horizontal" | "vertical";
  showDetails?: boolean;
  className?: string;
}

export const GamificationContent = ({
  direction = "horizontal",
  showDetails = false,
  className,
}: GamificationContentProps) => {
  const { stats } = useGamification();
  const { level, points, streak, pointsToNextLevel, readArticles } = stats;

  const hasStreaks = useVariableValue(FLAGS.GAMIFICATION.STREAKS, false);
  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);

  const containerClass = cn("gap-3", direction === "vertical" ? "flex flex-col" : "flex items-center", className);

  const statsClass = cn("flex items-center gap-2", direction === "vertical" && "w-full justify-between");

  return (
    <div className={containerClass}>
      <div className={statsClass}>
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">Level {level}</span>
        </div>
        <Badge variant="secondary" className="px-2 py-0.5">
          {points} XP
        </Badge>
      </div>

      {hasStreaks && (
        <div className={statsClass}>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-medium">Streak</span>
          </div>
          <Badge variant="secondary" className="px-2 py-0.5">
            {streak} Days
          </Badge>
        </div>
      )}

      {hasPointBoost && (
        <div className={statsClass}>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            <span className="font-medium">Points Boost</span>
          </div>
          <Badge variant="secondary" className="px-2 py-0.5">
            2x Active
          </Badge>
        </div>
      )}

      {showDetails && (
        <div className="mt-2 space-y-2 border-t pt-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Next Level</span>
            <span>{pointsToNextLevel} XP needed</span>
          </div>
          <div className="flex justify-between">
            <span>Articles Read</span>
            <span>{readArticles} total</span>
          </div>
        </div>
      )}
    </div>
  );
};
