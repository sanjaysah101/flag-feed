/* eslint-disable no-console */
import type { Feed, FeedItem as FeedItemType } from "@prisma/client";
import { BookOpen, ExternalLink } from "lucide-react";

import { useGamification } from "@/hooks/useGamification";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface FeedItemProps {
  item: FeedItemType & { feed: Feed };
  userId: string;
  onRead: () => void;
}

export const FeedItem = ({ item, userId, onRead }: FeedItemProps) => {
  const { isProcessing } = useGamification();

  const markAsRead = async (itemId: string) => {
    try {
      const response = await fetch(`/api/feeds/items/${itemId}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark article as read");
      }
    } catch (error) {
      console.error("Error marking article as read:", error);
      throw error;
    }
  };

  const handleReadArticle = async () => {
    try {
      await markAsRead(item.id);
      //   await triggerAction("READ_ARTICLE");
      onRead();
    } catch (error) {
      console.error("Error in handleReadArticle:", error);
    }
  };

  return (
    <Card className={item.isRead ? "opacity-75" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={item.isRead || isProcessing} onClick={handleReadArticle}>
              <BookOpen className="mr-1 h-4 w-4" />
              {item.isRead ? "Read" : "Mark as Read"}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open article</span>
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
