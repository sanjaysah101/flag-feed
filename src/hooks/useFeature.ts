import { useVariableValue } from "@devcycle/nextjs-sdk";

import { getVariableValue } from "@/lib/devcycle/config";
import { FLAGS } from "@/lib/devcycle/flags";

type FlagKeys =
  | (typeof FLAGS.RSS)[keyof typeof FLAGS.RSS]
  | (typeof FLAGS.GAMIFICATION)[keyof typeof FLAGS.GAMIFICATION]
  | (typeof FLAGS.LEARNING)[keyof typeof FLAGS.LEARNING];

// Client-side hook
export const useFeature = (key: FlagKeys, defaultValue: boolean = false) => {
  return useVariableValue(key, defaultValue);
};

// Server-side utility
export const getFeature = async (key: FlagKeys, defaultValue: boolean = false) => {
  return await getVariableValue(key, defaultValue);
};
