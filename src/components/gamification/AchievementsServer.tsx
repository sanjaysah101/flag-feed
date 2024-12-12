import { getVariableValue } from "@/lib/devcycle/config";
import { FLAGS } from "@/lib/devcycle/flags";
import { getUserStats } from "@/lib/services/gamification.service";

import { AchievementsClient } from "./AchievementsClient";

export const Achievements = async ({ userId }: { userId: string }) => {
  const stats = await getUserStats(userId);
  const achievements = await getVariableValue(FLAGS.GAMIFICATION.ACHIEVEMENTS, false);

  if (!achievements) return null;

  return <AchievementsClient initialAchievements={stats.achievements} />;
};
