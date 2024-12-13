"use client";

import { useEffect, useState } from "react";

import { Medal, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface LeaderboardEntry {
  userId: string;
  name: string;
  image?: string;
  points: number;
  rank: number;
  level: number;
}

export const Leaderboard = () => {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/gamification/leaderboard");
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading leaderboard...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium">#{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Readers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center justify-between rounded-lg p-2 ${
              entry.userId === session?.user?.id ? "bg-muted" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 text-center">{getRankBadge(entry.rank)}</div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.image} />
                <AvatarFallback>{entry.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{entry.name}</p>
                <p className="text-sm text-muted-foreground">Level {entry.level}</p>
              </div>
            </div>
            <Badge variant="secondary">{entry.points} XP</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
