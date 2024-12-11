"use client";

import { useCallback, useState } from "react";

import { Loader2 } from "lucide-react";

import { useToast } from "@/hooks";
import { useRSSFeeds } from "@/hooks/useRSSFeeds";

import { ClientOnly } from "../client-wrapper";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const AddFeedForm = () => {
  const [url, setUrl] = useState("");
  const { addFeed } = useRSSFeeds();
  const { toast } = useToast();

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
        await addFeed.mutateAsync({ url });

        // Reset form
        setUrl("");

        toast({
          title: "Success",
          description: "Feed added successfully",
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to add feed. Please try again.";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [url, addFeed, toast]
  );

  return (
    <ClientOnly>
      <form onSubmit={handleSubmit} className="flex gap-4">
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
      </form>
    </ClientOnly>
  );
};
