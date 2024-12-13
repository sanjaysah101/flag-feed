"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { useToast } from "@/hooks/useToast";
import { GamificationStats } from "@/types/gamification";

interface GamificationContextType {
  stats: GamificationStats;
  isLoading: boolean;
  refreshStats: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    streak: 0,
    level: 1,
    articlesRead: 0,
    achievements: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/gamification/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to fetch gamification stats",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <GamificationContext.Provider
      value={{
        stats,
        isLoading,
        refreshStats: fetchStats,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error("useGamificationContext must be used within a GamificationProvider");
  }
  return context;
};
