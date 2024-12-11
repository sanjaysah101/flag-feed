"use client";

import { useCallback, useEffect, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { FeedCategory, type FeedItem } from "@prisma/client";
import { ArrowUpDown, Filter, RefreshCw } from "lucide-react";

import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { trackFeatureUsage } from "@/lib/devcycle/analytics";
import { FLAGS } from "@/lib/devcycle/flags";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const FEED_CATEGORIES = Object.values(FeedCategory);

export const RealtimeFeed = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Feature flags
  const isRealtime = useVariableValue(FLAGS.RSS.REALTIME_UPDATES, false);
  const hasAdvancedFiltering = useVariableValue(FLAGS.RSS.ADVANCED_FILTERING, false);
  const hasCategories = useVariableValue(FLAGS.RSS.CATEGORIES, false);

  // Track realtime connection status
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isRealtime) {
      setIsConnected(true);
      trackFeatureUsage({
        featureId: FLAGS.RSS.REALTIME_UPDATES,
        userId,
        value: true,
        metadata: {
          connectionStatus: "connected",
          timestamp: new Date().toISOString(),
        },
      });
    }
    return () => setIsConnected(false);
  }, [isRealtime, userId]);

  const handleNewItem = useCallback(
    (newItem: FeedItem) => {
      if (isRealtime) {
        setItems((prev) => {
          const updatedItems = [newItem, ...prev];
          // Apply filtering if enabled
          if (hasAdvancedFiltering && selectedCategory !== "all") {
            return updatedItems.filter((item) => item.category === selectedCategory);
          }
          return updatedItems;
        });

        trackFeatureUsage({
          featureId: FLAGS.RSS.REALTIME_UPDATES,
          userId,
          value: true,
          metadata: {
            itemId: newItem.id,
            category: newItem.category ?? undefined,
            timestamp: new Date().toISOString(),
          },
        });
      }
    },
    [isRealtime, userId, hasAdvancedFiltering, selectedCategory]
  );

  useSupabaseRealtime<FeedItem>(
    {
      event: "INSERT",
      table: "FeedItem",
      filter: `userId=eq.${userId}`,
    },
    handleNewItem
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/feeds/items?userId=${userId}`);
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to refresh feeds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setItems((prev) => [...prev].reverse());
  };

  const filteredItems = items
    .filter((item) => !hasAdvancedFiltering || selectedCategory === "all" || item.category === selectedCategory)
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
    });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">
          Feed Items {isRealtime && isConnected && <Badge variant="default">Live</Badge>}
        </CardTitle>
        <div className="flex items-center gap-2">
          {!hasAdvancedFiltering && hasCategories && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {FEED_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="icon" onClick={toggleSortOrder}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-lg border p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {hasCategories && item.category && (
              <Badge variant="secondary" className="mt-2">
                {item.category}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
