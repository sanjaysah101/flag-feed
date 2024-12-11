"use server";

import { getVariableValue } from "./config";
import { FLAGS } from "./flags";

interface FeatureEvent {
  featureId: string;
  userId: string;
  value: boolean | string | number;
  metadata?: {
    questionId?: string;
    articleId?: string;
    difficulty?: string;
    timestamp?: string;
    [key: string]: string | undefined;
  };
}

export const trackFeatureUsage = async (event: FeatureEvent) => {
  try {
    const analyticsEnabled = await getVariableValue(FLAGS.ANALYTICS.ENABLED, true);
    if (!analyticsEnabled) return;

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to track feature usage:", error);
  }
};
