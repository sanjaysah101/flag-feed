"use server";

import Parser from "rss-parser";

import { prisma } from "@/lib/db/prisma";
import type { RSSFeed, RSSItem } from "@/types/rss";

import { getVariableValue } from "../devcycle/config";
import { FLAGS } from "../devcycle/flags";

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

    // Update feed with all available categories
    const feedCategories = Array.from(
      new Set(
        parsedFeed.items
          .flatMap((item) => item.categories || [])
          .filter(Boolean)
          .map((cat) => cat.toUpperCase().replace(/\s+/g, "_"))
      )
    );

    await prisma.feed.update({
      where: { id: feed.id },
      data: {
        title: parsedFeed.title || feed.url,
        description: parsedFeed.description,
        lastFetched: new Date(),
        categories: feedCategories, // Store all unique categories
      },
    });

    // Parse items with all categories
    const parsedItems = parsedFeed.items.map((item) => {
      const itemCategories = (item.categories || []).map((cat) => cat.toUpperCase().replace(/\s+/g, "_"));

      return {
        id: crypto.randomUUID(),
        feedId: feed.id,
        userId: feed.userId,
        title: item.title || "",
        description: item.contentSnippet || "",
        link: item.link || "",
        pubDate: new Date(item.pubDate || Date.now()),
        author: item.creator || item.author || null,
        content: item.content || item.contentSnippet || null,
        category: itemCategories[0] || null, // Primary category
        categories: itemCategories, // All categories
        readingTime: null,
        readStartTime: null,
        readEndTime: null,
        isRead: false,
        isSaved: false,
        createdAt: new Date(),
      };
    });

    // Save items to database
    await prisma.feedItem.createMany({
      data: parsedItems,
      skipDuplicates: true,
    });

    return parsedItems as RSSItem[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch RSS feed: ${error.message}`);
    }
    throw new Error("Failed to fetch RSS feed");
  }
};

const applyCategorization = async (feeds: RSSFeed[]): Promise<RSSFeed[]> => {
  // For now, return feeds as-is
  // TODO: Implement AI-based categorization when feature is ready
  return feeds;
};

export const processFeeds = async (userId: string) => {
  try {
    // Initialize feature flags with default values if they fail
    const [hasAdvancedFiltering, hasSmartCategorization] = await Promise.all([
      getVariableValue(FLAGS.RSS.ADVANCED_FILTERING, false).catch(() => false),
      getVariableValue(FLAGS.RSS.SMART_CATEGORIZATION, false).catch(() => false),
    ]);

    const feeds = await prisma.feed.findMany({
      where: { userId },
      include: {
        items: {
          orderBy: { pubDate: "desc" },
          take: hasAdvancedFiltering ? undefined : 10,
        },
      },
    });

    let processedFeeds = feeds.map((feed) => ({
      ...feed,
      description: feed.description || undefined,
      items: feed.items.map((item) => ({
        ...item,
        author: item.author || undefined,
        content: item.content || undefined,
      })),
    })) as RSSFeed[];

    if (hasSmartCategorization) {
      processedFeeds = await applyCategorization(processedFeeds);
    }

    return processedFeeds;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error processing feeds:", error instanceof Error ? error.message : error);
    throw new Error(`Failed to process feeds: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

export const addFeed = async (userId: string, url: string) => {
  try {
    // First parse the feed to get categories
    const parsedFeed = await parser.parseURL(url);

    // Extract and normalize categories
    const feedCategories = Array.from(
      new Set(
        parsedFeed.items
          .flatMap((item) => item.categories || [])
          .filter(Boolean)
          .map((cat) => cat.toUpperCase().replace(/\s+/g, "_"))
      )
    );

    // Create the feed without category field
    const feed = await prisma.feed.create({
      data: {
        url,
        title: parsedFeed.title || url,
        description: parsedFeed.description || null,
        categories: feedCategories,
        userId,
        lastFetched: new Date(),
      },
    });

    // Parse and save items
    const items = await fetchAndParseFeed(feed as RSSFeed);

    // Return the feed with items
    return {
      ...feed,
      items,
    };
  } catch (error) {
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
