import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

interface PointsData {
  points?: number;
  streak?: number;
  readArticles?: number;
  feedCount?: number;
  ping?: boolean;
}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start: async (controller) => {
      const send = async (data: PointsData) => {
        if (!data.ping) {
          // Get latest stats
          const [user, readCount, feedCount] = await Promise.all([
            prisma.user.findUnique({
              where: { id: userId },
              select: { points: true, streak: true },
            }),
            prisma.feedItem.count({
              where: {
                userId,
                isRead: true,
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
              },
            }),
            prisma.feed.count({
              where: { addedBy: userId },
            }),
          ]);

          data = {
            ...data,
            points: user?.points || 0,
            streak: user?.streak || 0,
            readArticles: readCount,
            feedCount,
          };
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial data
      await send({});

      // Keep connection alive
      const interval = setInterval(() => {
        send({ ping: true });
      }, 30000);

      // Cleanup
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
