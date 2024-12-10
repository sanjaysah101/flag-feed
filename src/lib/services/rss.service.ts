"use server";

import Parser from "rss-parser";

import { prisma } from "@/lib/db/prisma";
import type { FeedCategory, RSSFeed, RSSItem } from "@/types/rss";

type CustomFeed = { author: string };
type CustomItem = { author: string; content: string };

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    item: [
      ["content:encoded", "content"],
      ["dc:creator", "creator"],
    ],
  },
});

const fetchAndParseFeed = async (feed: RSSFeed): Promise<RSSItem[]> => {
  try {
    const parsedFeed = await parser.parseURL(feed.url);

    // Update feed title from the parsed feed
    await prisma.feed.update({
      where: { id: feed.id },
      data: {
        title: parsedFeed.title || feed.url,
        description: parsedFeed.description,
      },
    });

    const items = parsedFeed.items.map((item) => ({
      id: crypto.randomUUID(),
      feedId: feed.id,
      userId: feed.userId,
      title: item.title || "",
      description: item.contentSnippet || "",
      link: item.link || "",
      pubDate: new Date(item.pubDate || Date.now()),
      author: item.creator || item.author,
      content: item.content || item.contentSnippet || "",
      isRead: false,
      isSaved: false,
      createdAt: new Date(),
    }));

    // Save items to database, omitting categories field
    await prisma.feedItem.createMany({
      data: items,
      skipDuplicates: true,
    });

    return items;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching RSS feed:", error);
    throw new Error("Failed to fetch RSS feed");
  }
};

export const processFeeds = async (userId: string) => {
  try {
    const feeds = await prisma.feed.findMany({
      where: { userId },
      include: {
        items: {
          orderBy: { pubDate: "desc" },
          take: 10,
        },
      },
    });

    // Return feeds with items, let client handle filtering
    return feeds.map((feed) => ({
      ...feed,
      items: feed.items,
    }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error processing feeds:", error);
    throw new Error("Failed to process feeds");
  }
};

export const addFeed = async (userId: string, url: string, category: FeedCategory) => {
  try {
    // First create the feed
    const feed = await prisma.feed.create({
      data: {
        url,
        category,
        userId,
        title: url, // Temporary title, will be updated after fetching
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Then fetch and parse the feed
    const items = await fetchAndParseFeed(feed as RSSFeed);

    // Return the updated feed with items
    return {
      ...feed,
      items,
    };
  } catch (error) {
    // If anything fails, clean up the feed
    if (error instanceof Error) {
      throw new Error(`Failed to add feed: ${error.message}`);
    }
    throw error;
  }
};

export const deleteFeed = async (feedId: string, userId: string) => {
  try {
    const feed = await prisma.feed.findFirst({
      where: { id: feedId, userId },
    });

    if (!feed) {
      throw new Error("Feed not found");
    }

    await prisma.feed.delete({
      where: { id: feedId },
    });

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting feed:", error);
    throw new Error("Failed to delete feed");
  }
};

export const refreshFeed = async (feedId: string, userId: string) => {
  try {
    const feed = await prisma.feed.findFirst({
      where: { id: feedId, userId },
    });

    if (!feed) {
      throw new Error("Feed not found");
    }

    // Delete existing items
    await prisma.feedItem.deleteMany({
      where: { feedId },
    });

    // Fetch new items
    const items = await fetchAndParseFeed(feed as RSSFeed);

    return { ...feed, items };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error refreshing feed:", error);
    throw new Error("Failed to refresh feed");
  }
};
