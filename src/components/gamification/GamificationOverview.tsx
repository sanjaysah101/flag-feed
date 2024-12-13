"use client";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Flame, Star, Target, Trophy } from "lucide-react";

import { useGamification } from "@/hooks/useGamification";
import { FLAGS } from "@/lib/devcycle/flags";

import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";

export const GamificationOverview = () => {
  const { stats } = useGamification();
  const { points, streak, level } = stats;
  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Level {level}</p>
              <p className="text-2xl font-bold">{points} XP</p>
            </div>
          </div>
          <Progress value={points % 100} max={100} className="mt-4" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Rank</p>
              <p className="text-2xl font-bold">#42</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Streak</p>
              <p className="text-2xl font-bold">{streak} Days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasPointBoost && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Point Boost</p>
                <p className="text-2xl font-bold">2x</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
