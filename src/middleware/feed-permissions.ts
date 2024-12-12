import { type NextRequest } from "next/server";

import { getSession } from "next-auth/react";

import { prisma } from "@/lib/db/prisma";

export const canManageFeeds = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });

  // Users need at least 100 points to add new feeds
  return (user?.points ?? 0) >= 100;
};

export const validateFeedManagement = async (req: NextRequest) => {
  // Only check POST requests (adding new feeds)
  if (req.method !== "POST") return true;

  const session = await getSession();
  if (!session?.user) return false;

  return canManageFeeds(session.user.id);
};
