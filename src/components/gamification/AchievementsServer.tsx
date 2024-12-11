import { getUserStats } from "@/lib/services/gamification.service";

import { AchievementsClient } from "./AchievementsClient";

export const Achievements = async ({ userId }: { userId: string }) => {
  const stats = await getUserStats(userId);

  return <AchievementsClient initialAchievements={stats.achievements} />;
};
