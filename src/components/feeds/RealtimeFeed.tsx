"use client";

import Link from "next/link";
import { useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import { Feed, FeedItem as FeedItemType } from "@prisma/client";
import { BookOpen, Filter, Search, SortAsc, SortDesc } from "lucide-react";
import { useSession } from "next-auth/react";

import { toast } from "@/hooks";
import { useGamification } from "@/hooks/useGamification";
import { FLAGS } from "@/lib/devcycle/flags";
import { GAMIFICATION_ACTIONS } from "@/providers/GamificationProvider";

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

    if (!hasGamification) {
      const res = await triggerAction(GAMIFICATION_ACTIONS.READ_ARTICLE);
      if (res) {
        const { points } = res;

        toast({
          title: "Achievement Unlocked! 📚",
          description: `Bookworm: Read ${points} articles`,
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
          <div className="flex flex-col gap-4 lg:flex-row">
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

      <CardContent className="p-6">
        {filteredAndSortedItems.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedItems.map((item) => (
              <FeedItem
                key={item.id}
                item={item}
                userId={session?.user?.id || ""}
                onRead={() => handleItemRead(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center space-y-3 rounded-lg border border-dashed p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">No articles found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search or filters" : "Subscribe to feeds to see articles here"}
              </p>
            </div>
            {!searchQuery && (
              <Button variant="outline" asChild>
                <Link href="/feeds">Browse Feeds</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
