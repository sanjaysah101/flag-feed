import { NextResponse } from "next/server";

import { protectApiRoute } from "@/lib/auth/protect-api";
import { getVariableValue } from "@/lib/devcycle/config";
import { FLAGS } from "@/lib/devcycle/flags";

export const POST = async (request: Request) => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  try {
    const event = await request.json();
    const isEnabled = await getVariableValue(FLAGS.ANALYTICS.ENABLED, true);

    if (!isEnabled) {
      return NextResponse.json({ success: false, reason: "Analytics disabled" });
    }

    // TODO: Implement DevCycle analytics API call
    // For now, just log the event
    // eslint-disable-next-line no-console
    console.log("Analytics event:", event);

    return NextResponse.json({ success: true, event });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to track analytics" },
      { status: 500 }
    );
  }
};
