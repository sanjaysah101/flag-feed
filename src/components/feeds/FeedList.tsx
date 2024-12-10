"use client";

import { useState } from "react";

import { Loader2, RefreshCw, Trash2 } from "lucide-react";

import { useToast } from "@/hooks";
import { useFeature } from "@/hooks/useFeature";
import { useRSSFeeds } from "@/hooks/useRSSFeeds";
import { FLAGS } from "@/lib/devcycle/flags";
import type { RSSFeed, RSSItem } from "@/types/rss";

import { Badge, Button } from "../ui";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const FeedList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { feeds, isLoading } = useRSSFeeds();

  const hasAdvancedFiltering = useFeature(FLAGS.RSS.ADVANCED_FILTERING, false);

  const { deleteFeed, refreshFeed } = useRSSFeeds();
  const { toast } = useToast();

  const handleDelete = async (feedId: string) => {
    try {
      await deleteFeed.mutateAsync(feedId);
      toast({
        title: "Success",
        description: "Feed deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete feed",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async (feedId: string) => {
    try {
      await refreshFeed.mutateAsync(feedId);
      toast({
        title: "Success",
        description: "Feed refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to refresh feed",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading feeds...</div>;
  }

  if (!feeds?.length) {
    return <div>No feeds found. Add some feeds to get started!</div>;
  }

  const filteredFeeds = feeds
    ?.map((feed: RSSFeed) => ({
      ...feed,
      items: hasAdvancedFiltering
        ? feed.items.sort((a: RSSItem, b: RSSItem) => b.pubDate.getTime() - a.pubDate.getTime())
        : feed.items,
    }))
    .filter((feed: RSSFeed) => {
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
        {filteredFeeds?.map((feed: RSSFeed) => (
          <Card key={feed.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{feed.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRefresh(feed.id)}
                    disabled={refreshFeed.isPending || feed.isRefreshing}
                  >
                    {feed.isRefreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(feed.id)}
                    disabled={deleteFeed.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
