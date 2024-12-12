"use client";

import Link from "next/link";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Bell, Flame, Target, Trophy } from "lucide-react";

import { useGamification } from "@/hooks/useGamification";
import { FLAGS } from "@/lib/devcycle/flags";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export const TopNav = () => {
  const { points, streak, level } = useGamification();
  const hasPointBoost = useVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);
  const hasStreaks = useVariableValue(FLAGS.GAMIFICATION.STREAKS, false);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold">RSS Reader</h1>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Gamification Stats */}
          <Link href="/gamification">
            <Button variant="ghost" className="gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Level {level}</span>
              <Badge variant="secondary">{points} XP</Badge>
            </Button>
          </Link>

          {hasStreaks && (
            <Button variant="ghost" className="gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>{streak} Day Streak</span>
            </Button>
          )}

          {hasPointBoost && (
            <Badge variant="secondary" className="gap-1">
              <Target className="h-3 w-3 text-green-500" />
              2x Points
            </Badge>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
