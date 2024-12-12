"use server";

import { FeedCategory } from "@prisma/client";
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

// Add category mapping function
const mapToFeedCategory = (category: string): FeedCategory => {
  const normalizedCategory = category.toUpperCase().replace(/[^A-Z]/g, "_");

  // Map common variations to our categories
  const categoryMap: Record<string, FeedCategory> = {
    JAVASCRIPT: FeedCategory.PROGRAMMING,
    TYPESCRIPT: FeedCategory.PROGRAMMING,
    PYTHON: FeedCategory.PROGRAMMING,
    REACT: FeedCategory.WEB_DEVELOPMENT,
    NEXTJS: FeedCategory.WEB_DEVELOPMENT,
    DOCKER: FeedCategory.DEVOPS,
    KUBERNETES: FeedCategory.DEVOPS,
    AWS: FeedCategory.CLOUD,
    AZURE: FeedCategory.CLOUD,
    // Add more mappings as needed
  };

  return categoryMap[normalizedCategory] || FeedCategory.GENERAL;
};

const fetchAndParseFeed = async (feed: RSSFeed): Promise<RSSItem[]> => {
  try {
    const parsedFeed = await parser.parseURL(feed.url);

    // Map feed categories to our predefined categories
    const feedCategories = Array.from(
      new Set(
        parsedFeed.items
          .flatMap((item) => item.categories || [])
          .filter(Boolean)
          .map(mapToFeedCategory)
      )
    );

    await prisma.feed.update({
      where: { id: feed.id },
      data: {
        title: parsedFeed.title || feed.url,
        description: parsedFeed.description,
        lastFetched: new Date(),
        categories: feedCategories,
      },
    });

    // Parse items with mapped categories
    const parsedItems = parsedFeed.items.map((item) => {
      const itemCategories = (item.categories || [])
        .map(mapToFeedCategory)
        .filter((cat, index, array) => array.indexOf(cat) === index);

      return {
        id: crypto.randomUUID(),
        feedId: feed.id,
        userId: feed.addedBy,
        title: item.title || "",
        description: item.contentSnippet || "",
        link: item.link || "",
        pubDate: new Date(item.pubDate || Date.now()),
        author: item.creator || item.author || null,
        content: item.content || item.contentSnippet || null,
        category: itemCategories[0] || FeedCategory.GENERAL,
        categories: itemCategories,
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
      where: { addedBy: userId },
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

export const addFeed = async (userId: string, url: string, selectedCategories: FeedCategory[]) => {
  try {
    // First parse the feed to get metadata
    const parsedFeed = await parser.parseURL(url);

    // Combine user-selected categories with auto-detected ones
    const autoDetectedCategories = Array.from(
      new Set(
        parsedFeed.items
          .flatMap((item) => item.categories || [])
          .filter(Boolean)
          .map(mapToFeedCategory)
      )
    );

    const feedCategories = Array.from(new Set([...selectedCategories, ...autoDetectedCategories]));

    // Create the feed
    const feed = await prisma.feed.create({
      data: {
        url,
        title: parsedFeed.title || url,
        description: parsedFeed.description || null,
        categories: feedCategories,
        addedBy: userId,
        lastFetched: new Date(),
      },
    });

    // Parse and save items
    const items = await fetchAndParseFeed(feed as RSSFeed);

    // Update user preferences with new categories
    await prisma.preferences.upsert({
      where: { userId },
      create: {
        userId,
        subscribedCategories: feedCategories,
      },
      update: {
        subscribedCategories: {
          push: selectedCategories,
        },
      },
    });

    return {
      feed: {
        ...feed,
        items,
      },
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
      where: { id: feedId, addedBy: userId },
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
      where: { id: feedId, addedBy: userId },
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

export const getRecommendedFeeds = async (userId: string, category?: FeedCategory | null) => {
  try {
    const userPreferences = await prisma.preferences.findUnique({
      where: { userId },
      select: { subscribedCategories: true },
    });

    // Get approved feeds matching user's interests
    const recommendedFeeds = await prisma.feed.findMany({
      where: {
        status: "APPROVED",
        categories: {
          hasSome: userPreferences?.subscribedCategories || [],
        },
        ...(category && { categories: { has: category } }),
        NOT: {
          subscribers: {
            some: { id: userId },
          },
        },
      },
      take: 10,
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
    });

    return recommendedFeeds;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting recommended feeds:", error);
    throw error;
  }
};

export const getFeedsByCategory = async (userId: string, category: FeedCategory) => {
  return prisma.feed.findMany({
    where: {
      subscribers: {
        some: {
          id: userId,
        },
      },
      categories: {
        has: category,
      },
    },
    include: {
      items: {
        orderBy: {
          pubDate: "desc",
        },
        take: 10,
      },
    },
  });
};
