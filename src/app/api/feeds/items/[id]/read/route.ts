import { NextResponse } from "next/server";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { prisma } from "@/lib/db/prisma";

export const POST = async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;
  const { id } = await params;

  try {
    await prisma.feedItem.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to mark item as read: ${error}` }, { status: 500 });
  }
};
