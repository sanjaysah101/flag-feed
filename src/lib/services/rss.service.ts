import Parser from "rss-parser";

import { getFeature } from "@/hooks/useFeature";
import { prisma } from "@/lib/db/prisma";
import { FLAGS } from "@/lib/devcycle/flags";
import type { RSSItem } from "@/types/rss";

const parser = new Parser();

export class RSSService {
  static async fetchAndParseFeed(feedId: string, userId: string, url: string): Promise<RSSItem[]> {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.map((item) => ({
        id: crypto.randomUUID(),
        feedId,
        userId,
        title: item.title || "",
        description: item.contentSnippet || "",
        content: item.content || item.contentSnippet || "",
        link: item.link || "",
        pubDate: new Date(item.pubDate || Date.now()),
        author: item.creator,
        categories: item.categories || [],
        createdAt: new Date(),
      }));

      // Save to database
      await prisma.article.createMany({
        data: items.map((item) => ({
          id: item.id,
          feedId: item.feedId,
          userId: item.userId,
          title: item.title,
          content: item.content,
          description: item.description,
          url: item.link,
          publishedAt: item.pubDate,
          createdAt: item.createdAt,
          updatedAt: item.createdAt,
        })),
      });

      return items;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching RSS feed:", error);
      throw new Error("Failed to fetch RSS feed");
    }
  }

  static async processFeeds(userId: string) {
    const hasAdvancedFiltering = await getFeature(FLAGS.RSS.ADVANCED_FILTERING);
    const hasSmartCategorization = await getFeature(FLAGS.RSS.SMART_CATEGORIZATION);

    const userFeeds = await prisma.feed.findMany({
      where: { userId },
      include: { articles: true },
    });

    const processedFeeds = await Promise.all(
      userFeeds.map(async (feed) => {
        const articles = await this.fetchAndParseFeed(feed.id, userId, feed.url);

        // Apply feature-flagged processing
        if (hasAdvancedFiltering) {
          // Implement advanced filtering logic
          articles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
        }

        if (hasSmartCategorization) {
          // Implement smart categorization logic
          // This could be part of the DevCycle hackathon showcase
        }

        return { ...feed, articles };
      })
    );

    return processedFeeds;
  }
}
