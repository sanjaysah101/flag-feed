import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export const GET = async () => {
  try {
    // Get all unique categories from feeds and feed items
    const feedCategories = await prisma.feed.findMany({
      select: { categories: true },
    });

    const itemCategories = await prisma.feedItem.findMany({
      select: { categories: true },
    });

    // Combine and deduplicate categories
    const allCategories = Array.from(
      new Set([...feedCategories.flatMap((f) => f.categories), ...itemCategories.flatMap((i) => i.categories)])
    ).sort();

    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
};
