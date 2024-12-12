import { useState } from "react";

import { FeedCategory } from "@prisma/client";

import { useDiscoverFeeds } from "@/hooks/useDiscoverFeeds";
import { useToast } from "@/hooks/useToast";

import { RSSFeed } from "../../types/rss";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const DiscoverFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState<FeedCategory | undefined>();
  const { data, isLoading } = useDiscoverFeeds(selectedCategory);
  const { toast } = useToast();

  const handleSubscribe = async (feedId: string) => {
    try {
      const response = await fetch("/api/feeds/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedId }),
      });

      if (!response.ok) throw new Error("Failed to subscribe");

      toast({
        title: "Success",
        description: "Successfully subscribed to feed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe to feed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discover Feeds</h2>
        <Select value={selectedCategory || "ALL"} onValueChange={(value) => setSelectedCategory(value as FeedCategory)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {Object.values(FeedCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-10 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.feeds.map((feed: RSSFeed) => (
            <Card key={feed.id}>
              <CardHeader>
                <CardTitle>{feed.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {feed.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{feed.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleSubscribe(feed.id)}>
                  Subscribe
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
