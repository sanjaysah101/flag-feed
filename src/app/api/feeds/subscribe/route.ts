import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

import { protectApiRoute } from "../../../../lib/auth/protect-api";

export const POST = async (req: Request) => {
  try {
    const session = await protectApiRoute();
    if (session instanceof NextResponse) return session;

    const { feedId } = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscribedFeeds: {
          connect: { id: feedId },
        },
      },
    });

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe to feed" }, { status: 500 });
  }
};
