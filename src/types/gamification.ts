export interface Achievement {
  id: string;
  title: string;
  type: string;
  awardedAt: string;
  userId?: string;
}

export interface GamificationStats {
  level: number;
  points: number;
  streak: number;
  pointsToNextLevel: number;
  readArticles: number;
  feedCount: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completedAt?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  image?: string;
  points: number;
  rank: number;
  level: number;
}
