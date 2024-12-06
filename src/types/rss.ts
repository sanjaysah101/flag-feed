export interface RSSFeed {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  lastFetched?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RSSItem {
  id: string;
  feedId: string;
  title: string;
  description: string;
  content: string;
  link: string;
  pubDate: Date;
  author?: string;
  categories: string[];
  createdAt: Date;
}

export interface RSSCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
