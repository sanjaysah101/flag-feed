"use client";

import { useEffect } from "react";

import { useToast } from "@/hooks/useToast";
import { useGamificationContext } from "@/providers/GamificationProvider";

export const GamificationToast = () => {
  const { stats } = useGamificationContext();
  const { toast } = useToast();

  useEffect(() => {
    if (stats.achievements.length > 0) {
      const lastAchievement = stats.achievements[stats.achievements.length - 1];
      if (new Date(lastAchievement.awardedAt).getTime() > Date.now() - 5000) {
        toast({
          title: "Achievement Unlocked! 🎉",
          description: lastAchievement.title,
        });
      }
    }
  }, [stats.achievements, toast]);

  return null;
};
