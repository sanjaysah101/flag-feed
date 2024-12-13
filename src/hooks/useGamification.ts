"use client";

import { useEffect, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";

import { FLAGS } from "@/lib/devcycle/flags";

import { useToast } from "./useToast";

export const GAMIFICATION_ACTIONS = {
  READ_ARTICLE: "READ_ARTICLE",
  SHARE_ARTICLE: "SHARE_ARTICLE",
  DAILY_CHALLENGE: "DAILY_CHALLENGE",
} as const;

export type GamificationAction = keyof typeof GAMIFICATION_ACTIONS;

interface GamificationStats {
  points: number;
  streak: number;
  level: number;
  articlesRead: number;
  achievements: Array<{
    type: string;
    title: string;
  }>;
}

export const useGamification = () => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    streak: 0,
    level: 1,
    articlesRead: 0,
    achievements: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/gamification/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch gamification stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const triggerAction = async (action: GamificationAction) => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/gamification/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const { points, streak } = await response.json();

      setStats((prev) => ({
        ...prev,
        points,
        streak,
        level: Math.floor(points / 100) + 1,
      }));

      // Show appropriate toast messages
      if (points) {
        toast({
          title: "Points Awarded!",
          description: `+${points} points${hasPointBoost ? " (2x boost active!)" : ""}`,
        });
      }

      if (streak) {
        toast({
          title: "Streak Continued!",
          description: `You're on a ${streak} day streak!`,
        });
      }

      return { points, streak };
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to process action",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    ...stats,
    isLoading,
    isProcessing,
    triggerAction,
  };
};
