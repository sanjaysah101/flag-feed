export type FeedCategory =
  | "PROGRAMMING"
  | "DEVOPS"
  | "WEB_DEVELOPMENT"
  | "MOBILE"
  | "AI_ML"
  | "CLOUD"
  | "SECURITY"
  | "BLOCKCHAIN"
  | "DATA_SCIENCE";

export interface RSSFeed {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: FeedCategory;
  userId: string;
  lastFetched?: Date;
  createdAt: Date;
  updatedAt: Date;
  items: RSSItem[];
  isRefreshing?: boolean;
}

export interface RSSItem {
  id: string;
  feedId: string;
  userId: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  author?: string;
  categories?: string[];
  content?: string;
  isRead?: boolean;
  isSaved?: boolean;
  createdAt: Date;
}

export interface FeedResponse {
  feed: RSSFeed;
  items: RSSItem[];
}

export interface FeedListResponse {
  feeds: RSSFeed[];
  totalCount: number;
}
