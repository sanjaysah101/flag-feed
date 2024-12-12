import type { FeedCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useDiscoverFeeds = (category?: FeedCategory) => {
  return useQuery({
    queryKey: ["discover-feeds", category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append("category", category);

      const response = await fetch(`/api/feeds/discover?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch recommended feeds");
      }
      return response.json();
    },
  });
};
