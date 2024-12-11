export interface Achievement {
  id: string;
  title: string;
  type: string;
  awardedAt: Date;
  userId?: string;
}
