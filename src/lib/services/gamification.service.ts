import { prisma } from "@/lib/db/prisma";

import { getVariableValue } from "../devcycle/config";
import { FLAGS } from "../devcycle/flags";

export const awardPoints = async (userId: string, action: "read" | "share" | "streak") => {
  const pointValues = {
    read: 10,
    share: 5,
    streak: 15,
  };

  const hasPointBoost = await getVariableValue(FLAGS.GAMIFICATION.POINT_BOOST, false);
  const multiplier = hasPointBoost ? 2 : 1;

  const points = pointValues[action] * multiplier;

  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: points } },
  });

  return points;
};

export const getUserStats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      feedItems: {
        where: { isRead: true },
      },
    },
  });

  return {
    points: user?.points || 0,
    articlesRead: user?.feedItems.length || 0,
    // Add more stats as needed
  };
};
