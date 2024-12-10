"use client";

import { useEffect, useState } from "react";

import { getUserStats } from "@/lib/services/gamification.service";

import { Progress } from "../ui/progress";

export const Points = ({ userId }: { userId: string }) => {
  const [stats, setStats] = useState({ points: 0, articlesRead: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const userStats = await getUserStats(userId);
      setStats(userStats);
    };
    loadStats();
  }, [userId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Progress</h3>
        <span className="text-2xl font-bold">{stats.points} pts</span>
      </div>
      <Progress value={(stats.articlesRead / 100) * 100} className="h-2" />
      <p className="text-sm text-muted-foreground">{stats.articlesRead} articles read</p>
    </div>
  );
};
