import { NextResponse } from "next/server";

import { FeedCategory } from "@prisma/client";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { prisma } from "@/lib/db/prisma";

export const GET = async () => {
  try {
    const session = await protectApiRoute();
    if (session instanceof NextResponse) return session;

    // Get user's subscribed categories
    const userPreferences = await prisma.preferences.findUnique({
      where: { userId: session.user.id },
      select: { subscribedCategories: true },
    });

    // Return all available categories and user's subscribed ones
    return NextResponse.json({
      categories: Object.values(FeedCategory),
      subscribedCategories: userPreferences?.subscribedCategories || [],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
};
