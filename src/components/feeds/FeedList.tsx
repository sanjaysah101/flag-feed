"use client";

import { useState } from "react";

import { useFeature } from "@/hooks/useFeature";
import { useRSSFeeds } from "@/hooks/useRSSFeeds";
import { FLAGS } from "@/lib/devcycle/flags";
import type { RSSFeed } from "@/types/rss";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface FeedListProps {
  feeds: RSSFeed[];
}

export const FeedList = ({ feeds }: FeedListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoading } = useRSSFeeds();

  const hasAdvancedFiltering = useFeature(FLAGS.RSS.ADVANCED_FILTERING, false);

  if (isLoading) {
    return <div>Loading feeds...</div>;
  }

  if (!feeds?.length) {
    return <div>No feeds found. Add some feeds to get started!</div>;
  }

  const filteredFeeds = feeds
    ?.map((feed) => ({
      ...feed,
      items: hasAdvancedFiltering ? feed.items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()) : feed.items,
    }))
    .filter((feed) => {
      if (selectedCategory !== "all" && feed.category !== selectedCategory) return false;
      if (searchQuery && !feed.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

  return (
    <div className="space-y-6">
      {hasAdvancedFiltering && (
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(FLAGS.RSS).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search feeds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFeeds?.map((feed) => (
          <Card key={feed.id}>
            <CardHeader>
              <CardTitle>{feed.title}</CardTitle>
              <Badge>{feed.category}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feed.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
