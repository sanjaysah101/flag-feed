import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

interface PointsData {
  points?: number;
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
      const send = (data: PointsData) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial points
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { points: true },
      });
      send({ points: user?.points || 0 });

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
