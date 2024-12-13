/* eslint-disable no-console */
import type { Feed, FeedItem as FeedItemType } from "@prisma/client";
import { BookOpen, ExternalLink } from "lucide-react";

import { useGamification } from "@/hooks/useGamification";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Typography } from "../ui/typography";

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
      onRead();
    } catch (error) {
      console.error("Error in handleReadArticle:", error);
    }
  };

  // Generate a TL;DR from the description
  const getTLDR = (description: string) => {
    const words = description.split(" ");
    return words.length > 30 ? `${words.slice(0, 30).join(" ")}...` : description;
  };

  return (
    <Card className={`${item.isRead ? "opacity-75" : ""} mx-auto max-w-3xl`}>
      <CardContent className="p-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="line-clamp-2 font-medium leading-none">{item.title}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Typography className="line-clamp-2 text-sm text-muted-foreground">
                    TL;DR: {getTLDR(item.description || "")}
                  </Typography>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm" sideOffset={5}>
                  {item.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={item.isRead || isProcessing}
              onClick={handleReadArticle}
              className="whitespace-nowrap"
            >
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
