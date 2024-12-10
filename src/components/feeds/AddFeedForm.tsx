"use client";

import { useState } from "react";

import { useRSSFeeds, useToast } from "@/hooks";
import type { FeedCategory } from "@/types/rss";

import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui";

const FEED_CATEGORIES: { value: FeedCategory; label: string }[] = [
  { value: "PROGRAMMING", label: "Programming" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
  { value: "MOBILE", label: "Mobile" },
  { value: "AI_ML", label: "AI/ML" },
  { value: "CLOUD", label: "Cloud" },
  { value: "SECURITY", label: "Security" },
  { value: "BLOCKCHAIN", label: "Blockchain" },
  { value: "DATA_SCIENCE", label: "Data Science" },
];

export const AddFeedForm = () => {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<FeedCategory | "">("");
  const { addFeed } = useRSSFeeds();
  const { toast } = useToast();

  const handleCategoryChange = (value: string) => {
    setCategory(value as FeedCategory);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !category) return;

    try {
      await addFeed.mutateAsync({ url, category });
      setUrl("");
      setCategory("");
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
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        placeholder="Enter RSS feed URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="max-w-sm"
      />
      <Select value={category} onValueChange={handleCategoryChange} defaultValue="">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {FEED_CATEGORIES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!url || !category || addFeed.isPending}>
        {addFeed.isPending ? "Adding..." : "Add Feed"}
      </Button>
    </form>
  );
};
