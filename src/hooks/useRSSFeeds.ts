import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { FeedCategory } from "@/types/rss";

export const useRSSFeeds = () => {
  const queryClient = useQueryClient();

  const {
    data: feeds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const response = await fetch("/api/feeds");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch feeds");
      }
      const data = await response.json();
      return data.feeds;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 2, // Retry failed requests twice
  });

  const addFeed = useMutation({
    mutationFn: async ({ url, category }: { url: string; category: FeedCategory }) => {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, category }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add feed");
      }

      return response.json();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("Mutation error:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

  return {
    feeds,
    isLoading,
    error,
    addFeed,
  };
};
