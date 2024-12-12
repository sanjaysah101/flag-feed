import { NextResponse } from "next/server";

import { FeedCategory } from "@prisma/client";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { prisma } from "@/lib/db/prisma";

export const POST = async (req: Request) => {
  try {
    const session = await protectApiRoute();
    if (session instanceof NextResponse) return session;

    const { category } = await req.json();

    if (!Object.values(FeedCategory).includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Update user preferences
    await prisma.preferences.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        subscribedCategories: [category],
      },
      update: {
        subscribedCategories: {
          push: category,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error subscribing to category:", error);
    return NextResponse.json({ error: "Failed to subscribe to category" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const session = await protectApiRoute();
    if (session instanceof NextResponse) return session;

    const { category } = await req.json();

    if (!Object.values(FeedCategory).includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Get current preferences
    const preferences = await prisma.preferences.findUnique({
      where: { userId: session.user.id },
    });

    if (!preferences) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
    }

    // Update preferences removing the category
    await prisma.preferences.update({
      where: { userId: session.user.id },
      data: {
        subscribedCategories: preferences.subscribedCategories.filter((c) => c !== category),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error unsubscribing from category:", error);
    return NextResponse.json({ error: "Failed to unsubscribe from category" }, { status: 500 });
  }
};
