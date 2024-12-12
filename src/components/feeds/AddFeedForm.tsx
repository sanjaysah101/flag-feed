"use client";

import { useCallback, useEffect, useState } from "react";

import { FeedCategory } from "@prisma/client";
import { Loader2 } from "lucide-react";

import { useToast } from "@/hooks";
import { useRSSFeeds } from "@/hooks/useRSSFeeds";
import { cn } from "@/lib/utils";

import { ClientOnly } from "../client-wrapper";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const AddFeedForm = () => {
  const [url, setUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<FeedCategory[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<FeedCategory[]>([]);
  const { addFeed } = useRSSFeeds();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!url) return;
      try {
        const response = await fetch(`/api/feeds/suggest?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const { categories } = await response.json();
        setSuggestedCategories(categories);
      } catch (error) {
        toast({
          title: "Error",
          description: (error as Error).message || "Failed to fetch suggestions",
          variant: "destructive",
        });
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounce);
  }, [toast, url]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!url) {
        toast({
          title: "Error",
          description: "URL is required",
          variant: "destructive",
        });
        return;
      }

      try {
        await addFeed.mutateAsync({
          url,
          categories: selectedCategories,
        });

        setUrl("");
        setSelectedCategories([]);
        setSuggestedCategories([]);

        toast({
          title: "Success",
          description: "Feed added successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to add feed",
          variant: "destructive",
        });
      }
    },
    [url, selectedCategories, addFeed, toast]
  );

  return (
    <ClientOnly>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Enter RSS feed URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="max-w-sm"
            disabled={addFeed.isPending}
          />
          <Button type="submit" disabled={!url || addFeed.isPending}>
            {addFeed.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Feed"
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Select Categories:</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(FeedCategory).map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className={cn("cursor-pointer", suggestedCategories.includes(category) && "border-primary")}
                onClick={() => {
                  setSelectedCategories((prev) =>
                    prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
                  );
                }}
              >
                {category.replace(/_/g, " ")}
                {suggestedCategories.includes(category) && <span className="ml-1 text-xs">•</span>}
              </Badge>
            ))}
          </div>
        </div>
      </form>
    </ClientOnly>
  );
};
