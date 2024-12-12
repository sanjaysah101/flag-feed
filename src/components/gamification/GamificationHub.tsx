"use client";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Calendar, Share2, Star, Trophy } from "lucide-react";

import { useGamification } from "@/hooks/useGamification";
import { FLAGS } from "@/lib/devcycle/flags";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

export const GamificationHub = () => {
  const { points, level } = useGamification();
  const hasLeaderboard = useVariableValue(FLAGS.GAMIFICATION.LEADERBOARD, false);
  const hasDailyChallenges = useVariableValue(FLAGS.GAMIFICATION.DAILY_CHALLENGES, false);

  return (
    <div className="space-y-6">
      {/* Points and Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Level {level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={points % 100} max={100} />
          <p className="mt-2 text-sm text-muted-foreground">{100 - (points % 100)} XP to next level</p>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      {hasDailyChallenges && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Daily Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Read 3 articles</span>
                <Progress value={1} max={3} className="w-24" />
              </div>
              <div className="flex items-center justify-between">
                <span>Share an article</span>
                <Button size="sm" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Preview */}
      {hasLeaderboard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              Top Readers
            </CardTitle>
          </CardHeader>
          <CardContent>{/* Add leaderboard implementation */}</CardContent>
        </Card>
      )}
    </div>
  );
};
