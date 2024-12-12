"use client";

import { useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Feed, FeedItem as FeedItemType } from "@prisma/client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { BookOpen, Filter, Search, SortAsc, SortDesc } from "lucide-react";
import { useSession } from "next-auth/react";

import { toast } from "@/hooks";
import { useGamification } from "@/hooks/useGamification";
import { FLAGS } from "@/lib/devcycle/flags";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FeedItem } from "./FeedItem";

interface RealtimeFeedProps {
  initialItems: (FeedItemType & { feed: Feed })[];
}

export const RealtimeFeed = ({ initialItems = [] }: RealtimeFeedProps) => {
  const supabase = useSupabaseClient();
  const { data: session } = useSession();
  const [items, setItems] = useState(initialItems);
  const [readCount, setReadCount] = useState(initialItems?.filter((item) => item.isRead).length || 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterBy, setFilterBy] = useState<"all" | "unread" | "read">("all");

  const hasGamification = useVariableValue(FLAGS.GAMIFICATION.ENABLED, false);
  const hasAdvancedFiltering = useVariableValue(FLAGS.RSS.ADVANCED_FILTERING, false);
  const { triggerAction } = useGamification();

  const handleItemRead = async (itemId: string) => {
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, isRead: true } : item));
    setItems(updatedItems);
    setReadCount((prev) => prev + 1);

    if (hasGamification) {
      // Track reading progress in Supabase
      await supabase.from("reading_progress").upsert({
        user_id: session?.user?.id,
        article_id: itemId,
        read_at: new Date().toISOString(),
      });

      // Trigger gamification action
      await triggerAction("READ_ARTICLE");

      // Check for reading achievements
      const { count } = await supabase
        .from("reading_progress")
        .select("*", { count: "exact" })
        .eq("user_id", session?.user?.id)
        .single();

      if (count === 5) {
        toast({
          title: "Achievement Unlocked! 📚",
          description: "Bookworm: Read 5 articles",
        });
      }
    }
  };

  const filteredAndSortedItems = items
    .filter((item) => {
      if (filterBy === "read") return item.isRead;
      if (filterBy === "unread") return !item.isRead;
      return true;
    })
    .filter((item) =>
      searchQuery
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Articles</CardTitle>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">{readCount} Read</Badge>
          </div>
        </div>

        {hasAdvancedFiltering && (
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as typeof filterBy)}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}>
                {sortOrder === "desc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredAndSortedItems.map((item) => (
          <FeedItem key={item.id} item={item} userId={session?.user?.id || ""} onRead={() => handleItemRead(item.id)} />
        ))}
        {filteredAndSortedItems.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {items.length === 0
              ? "No articles yet. Add some RSS feeds to get started!"
              : "No articles match your filters."}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
