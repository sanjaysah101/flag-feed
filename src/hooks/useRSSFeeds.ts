import { FeedCategory } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { RSSFeed } from "@/types/rss";

export const useRSSFeeds = () => {
  const queryClient = useQueryClient();

  const { data: feeds, isLoading } = useQuery({
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
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const deleteFeed = useMutation({
    mutationFn: async (feedId: string) => {
      const response = await fetch(`/api/feeds/${feedId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete feed");
      }
      return response.json();
    },
    onMutate: async (feedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["feeds"] });

      // Snapshot the previous value
      const previousFeeds = queryClient.getQueryData(["feeds"]);

      // Optimistically update feeds
      queryClient.setQueryData<RSSFeed[]>(["feeds"], (old) => old?.filter((feed: RSSFeed) => feed.id !== feedId));

      return { previousFeeds };
    },
    onError: (_error, _feedId, context) => {
      // Rollback on error
      if (context?.previousFeeds) {
        queryClient.setQueryData(["feeds"], context.previousFeeds);
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

  const refreshFeed = useMutation({
    mutationFn: async (feedId: string) => {
      const response = await fetch(`/api/feeds/${feedId}`, {
        method: "PUT",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to refresh feed");
      }
      return response.json();
    },
    onMutate: async (feedId) => {
      await queryClient.cancelQueries({ queryKey: ["feeds"] });
      const previousFeeds = queryClient.getQueryData(["feeds"]);

      // Optimistically update to show loading state
      queryClient.setQueryData<RSSFeed[]>(["feeds"], (old) =>
        old?.map((feed: RSSFeed) => (feed.id === feedId ? { ...feed, isRefreshing: true } : feed))
      );

      return { previousFeeds };
    },
    onSuccess: (data, feedId) => {
      // Update only the specific feed with new data
      queryClient.setQueryData<RSSFeed[]>(["feeds"], (old) =>
        old?.map((feed: RSSFeed) => (feed.id === feedId ? { ...data.feed, isRefreshing: false } : feed))
      );
    },
    onError: (_error, _feedId, context) => {
      if (context?.previousFeeds) {
        queryClient.setQueryData(["feeds"], context.previousFeeds);
      }
    },
  });

  const addFeed = useMutation({
    mutationFn: async ({ url, categories }: { url: string; categories: FeedCategory[] }) => {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, categories }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add feed");
      }
      return response.json();
    },
    onMutate: async (newFeed) => {
      await queryClient.cancelQueries({ queryKey: ["feeds"] });
      const previousFeeds = queryClient.getQueryData(["feeds"]);

      // Optimistically add the new feed with a temporary state
      queryClient.setQueryData<RSSFeed[]>(["feeds"], (old = []) => [
        ...old,
        {
          id: crypto.randomUUID(),
          url: newFeed.url,
          title: newFeed.url,
          description: null,
          categories: [],
          userId: "",
          lastFetched: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [],
          isRefreshing: true,
          status: "PENDING",
          addedBy: "",
        } as RSSFeed,
      ]);

      return { previousFeeds };
    },
    onSuccess: (data) => {
      // Update with actual feed data from server
      queryClient.setQueryData<RSSFeed[]>(["feeds"], (old = []) =>
        old.map((feed) => (feed.url === data.feed.url ? data.feed : feed))
      );
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousFeeds) {
        queryClient.setQueryData(["feeds"], context.previousFeeds);
      }
    },
  });

  return {
    feeds,
    isLoading,
    addFeed,
    deleteFeed,
    refreshFeed,
  };
};
