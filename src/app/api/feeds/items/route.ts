import { NextResponse } from "next/server";

import { FeedCategory } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const category = searchParams.get("category");
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const sortBy = searchParams.get("sortBy") || "date";

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const items = await prisma.feedItem.findMany({
      where: {
        userId,
        ...(category &&
          category !== "ALL" && {
            category: category as FeedCategory,
          }),
        ...(unreadOnly && {
          isRead: false,
        }),
      },
      orderBy:
        sortBy === "date"
          ? { pubDate: "desc" }
          : [
              { isRead: "asc" }, // Show unread first
              { pubDate: "desc" }, // Then by date
            ],
      take: 10,
      include: {
        feed: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch feed items" },
      { status: 500 }
    );
  }
};
