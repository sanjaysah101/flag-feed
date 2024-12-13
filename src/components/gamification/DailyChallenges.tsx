"use client";

import { useEffect, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { BookOpen, Share2, Target } from "lucide-react";

import { FLAGS } from "@/lib/devcycle/flags";

import { useGamificationContext } from "../../providers/GamificationProvider";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  icon: React.ReactNode;
  action?: () => void;
}

export const DailyChallenges = () => {
  const { stats } = useGamificationContext();
  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    setChallenges([
      {
        id: "daily-reads",
        title: "Daily Reader",
        description: "Read 3 articles today",
        target: 3,
        current: stats.articlesRead,
        icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "share-article",
        title: "Social Butterfly",
        description: "Share an article with friends",
        target: 1,
        current: 0,
        icon: <Share2 className="h-5 w-5 text-green-500" />,
        action: () => {
          // Implement sharing functionality
          alert("Sharing functionality not implemented");
        },
      },
      {
        id: "point-boost",
        title: "Point Boost",
        description: "Complete challenges to earn 2x points",
        target: hasPointBoost ? 1 : 0,
        current: hasPointBoost ? 1 : 0,
        icon: <Target className="h-5 w-5 text-purple-500" />,
      },
    ]);
  }, [stats.articlesRead, hasPointBoost]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {challenges.map((challenge) => (
        <Card key={challenge.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {challenge.icon}
              {challenge.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
            <Progress value={(challenge.current / challenge.target) * 100} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span>
                {challenge.current}/{challenge.target}
              </span>
              {challenge.action && (
                <Button size="sm" variant="outline" onClick={challenge.action}>
                  Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
