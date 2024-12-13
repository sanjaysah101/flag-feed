"use client";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Calendar, Share2, Star, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/hooks/useGamification";
import { FLAGS } from "@/lib/devcycle/flags";
import { GAMIFICATION_ACTIONS } from "@/providers/GamificationProvider";

export const GamificationHub = () => {
  const { stats, triggerAction, isProcessing } = useGamification();
  const hasLeaderboard = useVariableValue(FLAGS.GAMIFICATION.LEADERBOARD, false);
  const hasDailyChallenges = useVariableValue(FLAGS.GAMIFICATION.DAILY_CHALLENGES, false);

  const handleShareArticle = async () => {
    await triggerAction(GAMIFICATION_ACTIONS.SHARE_ARTICLE);
  };

  const handleDailyChallenge = async () => {
    await triggerAction(GAMIFICATION_ACTIONS.DAILY_CHALLENGE);
  };

  return (
    <div className="space-y-6">
      {/* Points and Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Level {stats.level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={stats.points % 100} max={100} />
          <p className="mt-2 text-sm text-muted-foreground">{stats.pointsToNextLevel} XP to next level</p>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      {!hasDailyChallenges && (
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
                <div className="space-y-1">
                  <span className="text-sm font-medium">Read Articles</span>
                  <p className="text-xs text-muted-foreground">Read 3 articles today</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{stats.readArticles % 3}/3</span>
                  <Progress value={stats.readArticles % 3} max={3} className="w-24" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium">Share Article</span>
                  <p className="text-xs text-muted-foreground">Share an article with others</p>
                </div>
                <Button size="sm" variant="outline" onClick={handleShareArticle} disabled={isProcessing}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium">Complete Daily Tasks</span>
                  <p className="text-xs text-muted-foreground">Complete all daily challenges</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDailyChallenge}
                  disabled={isProcessing || stats.readArticles % 3 !== 2} // Enable when 3 articles are read
                >
                  Claim Reward
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
