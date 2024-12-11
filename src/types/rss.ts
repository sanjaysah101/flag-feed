import { type Feed, type FeedItem } from "@prisma/client";

// Extend the base Feed type from Prisma
export interface RSSFeed extends Feed {
  items: RSSItem[];
  isRefreshing?: boolean;
}

// Extend the base FeedItem type from Prisma
export interface RSSItem extends Omit<FeedItem, "isRead" | "isSaved"> {
  categories: string[];
  isRead: boolean;
  isSaved: boolean;
}

export interface FeedResponse {
  feed: RSSFeed;
  items: RSSItem[];
}

export interface FeedListResponse {
  feeds: RSSFeed[];
  totalCount: number;
}
