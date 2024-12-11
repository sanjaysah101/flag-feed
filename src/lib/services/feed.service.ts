import { prisma } from "@/lib/db/prisma";

export const getFeedItem = async (id: string) => {
  const item = await prisma.feedItem.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      link: true,
      pubDate: true,
      author: true,
    },
  });

  return item;
};
