export interface Achievement {
  id: string;
  title: string;
  type: string;
  awardedAt: string;
  userId?: string;
}

export interface GamificationStats {
  points: number;
  streak: number;
  level: number;
  articlesRead: number;
  achievements: Array<{
    id: string;
    type: string;
    title: string;
    awardedAt: string;
  }>;
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
