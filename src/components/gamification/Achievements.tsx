"use client";

import { useEffect, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Trophy } from "lucide-react";

import { FLAGS } from "@/lib/devcycle/flags";
import { getUserStats } from "@/lib/services/gamification.service";
import type { Achievement } from "@/types/gamification";

import { Badge } from "../ui/badge";

export const Achievements = ({ userId }: { userId: string }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const hasAchievements = useVariableValue(FLAGS.GAMIFICATION.ACHIEVEMENTS, false);

  useEffect(() => {
    if (hasAchievements) {
      const loadAchievements = async () => {
        const stats = await getUserStats(userId);
        setAchievements(stats.achievements);
      };
      loadAchievements();
    }
  }, [userId, hasAchievements]);

  if (!hasAchievements) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        <h3 className="text-lg font-medium">Achievements</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {achievements.map((achievement) => (
          <Badge key={achievement.id} variant="secondary">
            {achievement.title}
          </Badge>
        ))}
      </div>
    </div>
  );
};
