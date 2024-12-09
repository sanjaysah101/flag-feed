import { NextResponse } from "next/server";

import { auth } from "@/auth";

export const protectApiRoute = async () => {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session;
};
