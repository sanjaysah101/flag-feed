"use client";

import { createContext, useCallback, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";

import { useToast } from "@/hooks/useToast";
import { FLAGS } from "@/lib/devcycle/flags";
import { GamificationStats } from "@/types/gamification";

export const GAMIFICATION_ACTIONS = {
  READ_ARTICLE: "READ_ARTICLE",
  SHARE_ARTICLE: "SHARE_ARTICLE",
  DAILY_CHALLENGE: "DAILY_CHALLENGE",
  ADD_FEED: "ADD_FEED",
} as const;

export type GamificationAction = keyof typeof GAMIFICATION_ACTIONS;

interface GamificationContextType {
  stats: GamificationStats;
  isLoading: boolean;
  isProcessing: boolean;
  triggerAction: (action: GamificationAction) => Promise<{ points: number; streak: number } | null>;
  refreshStats: () => Promise<void>;
}

export const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<GamificationStats>({
    level: 1,
    points: 0,
    streak: 0,
    pointsToNextLevel: 100,
    readArticles: 0,
    feedCount: 0,
  });

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetch("/api/gamification/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch gamification stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerAction = async (action: GamificationAction) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/gamification/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const { points, streak } = await response.json();

      // Update local stats
      setStats((prev) => ({
        ...prev,
        points: prev.points + points,
        streak: streak,
        level: Math.floor((prev.points + points) / 100) + 1,
        pointsToNextLevel: 100 - ((prev.points + points) % 100),
        readArticles: action === GAMIFICATION_ACTIONS.READ_ARTICLE ? prev.readArticles + 1 : prev.readArticles,
        feedCount: action === GAMIFICATION_ACTIONS.ADD_FEED ? prev.feedCount + 1 : prev.feedCount,
      }));

      if (points) {
        toast({
          title: "Points Awarded!",
          description: `+${points} points${hasPointBoost ? " (2x boost active!)" : ""}`,
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

  return (
    <GamificationContext.Provider value={{ stats, isLoading, isProcessing, triggerAction, refreshStats }}>
      {children}
    </GamificationContext.Provider>
  );
};
