"use client";

import { useCallback, useEffect, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { FeedCategory, type FeedItem } from "@prisma/client";
import { ArrowUpDown, ChevronLeft, ChevronRight, Clock, RefreshCw } from "lucide-react";

import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { trackFeatureUsage } from "@/lib/devcycle/analytics";
import { FLAGS } from "@/lib/devcycle/flags";

import { toast } from "../../hooks";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface RealtimeFeedProps {
  userId: string;
}

const ITEMS_PER_PAGE = 5;

export const RealtimeFeed = ({ userId }: RealtimeFeedProps) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FeedCategory | "ALL">("ALL");
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "relevance">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [subscribedCategories, setSubscribedCategories] = useState<FeedCategory[]>([]);

  const hasAdvancedFiltering = useVariableValue(FLAGS.RSS.ADVANCED_FILTERING, false);
  const hasRealtime = useVariableValue(FLAGS.RSS.REALTIME_UPDATES, false);

  // Fetch subscribed categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/feeds/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const { subscribedCategories } = await response.json();
        setSubscribedCategories(subscribedCategories);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching categories:", error);
        setSubscribedCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Load initial feed items
  const loadFeedItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/feeds/items?userId=${userId}&category=${selectedCategory}&unreadOnly=${showUnreadOnly}&sortBy=${sortBy}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      toast({
        title: "Error loading feed items",
        description: (error as Error).message,
        variant: "destructive",
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId, selectedCategory, showUnreadOnly, sortBy]);

  useEffect(() => {
    loadFeedItems();
  }, [loadFeedItems]);

  // Subscribe to realtime updates
  useSupabaseRealtime<FeedItem>(
    {
      event: "INSERT",
      schema: "public",
      table: "FeedItem",
      filter: `userId=eq.${userId}`,
    },
    (payload) => {
      if (hasRealtime) {
        setItems((prev) => [payload, ...prev]);
      }
    }
  );

  const handleRefresh = async () => {
    await loadFeedItems();
    trackFeatureUsage({
      featureId: FLAGS.RSS.REALTIME_UPDATES,
      userId,
      value: true,
    });
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (showUnreadOnly && item.isRead) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {hasAdvancedFiltering && (
            <div className="flex items-center gap-4">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as FeedCategory | "ALL")}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {subscribedCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "relevance")}>
                <SelectTrigger className="w-40">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="unreadOnly"
                  checked={showUnreadOnly}
                  onCheckedChange={(checked) => setShowUnreadOnly(checked as boolean)}
                />
                <label htmlFor="unreadOnly" className="text-sm font-medium">
                  Unread only
                </label>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {hasAdvancedFiltering && items.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {items.length} items
            </Badge>
            {showUnreadOnly && (
              <Badge variant="outline" className="text-xs">
                Unread only
              </Badge>
            )}
            {selectedCategory !== "ALL" && (
              <Badge variant="outline" className="text-xs">
                {selectedCategory.replace("_", " ")}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {paginatedItems.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(item.pubDate).toLocaleDateString()}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <ArrowUpDown className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
