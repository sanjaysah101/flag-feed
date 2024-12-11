"use client";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Trophy } from "lucide-react";

import { FLAGS } from "@/lib/devcycle/flags";
import type { Achievement } from "@/types/gamification";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface AchievementsClientProps {
  initialAchievements: Achievement[];
}

export const AchievementsClient = ({ initialAchievements }: AchievementsClientProps) => {
  const hasAchievements = useVariableValue(FLAGS.GAMIFICATION.ACHIEVEMENTS, false);

  if (!hasAchievements) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements
          <Badge variant="secondary" className="ml-2">
            {initialAchievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {initialAchievements.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {initialAchievements.map((achievement) => (
              <Badge key={achievement.id} variant="outline" className="px-3 py-1 text-sm">
                {achievement.type === "points" && "🏆 "}
                {achievement.type === "reading" && "📚 "}
                {achievement.title}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Complete actions to earn achievements!</p>
        )}
      </CardContent>
    </Card>
  );
};
