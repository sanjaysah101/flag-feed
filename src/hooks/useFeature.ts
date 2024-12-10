import { useVariableValue } from "@devcycle/nextjs-sdk";

import { FLAGS } from "@/lib/devcycle/flags";

type FlagKeys =
  | (typeof FLAGS.RSS)[keyof typeof FLAGS.RSS]
  | (typeof FLAGS.GAMIFICATION)[keyof typeof FLAGS.GAMIFICATION]
  | (typeof FLAGS.LEARNING)[keyof typeof FLAGS.LEARNING];

// Client-side hook
export const useFeature = (key: FlagKeys, defaultValue: boolean = false) => {
  return useVariableValue(key, defaultValue);
};
