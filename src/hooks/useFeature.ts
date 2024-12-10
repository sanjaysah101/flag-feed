import { useVariableValue } from "@devcycle/nextjs-sdk";

import { FLAGS } from "@/lib/devcycle/flags";

type FlagKeys =
  | (typeof FLAGS.RSS)[keyof typeof FLAGS.RSS]
  | (typeof FLAGS.GAMIFICATION)[keyof typeof FLAGS.GAMIFICATION]
  | (typeof FLAGS.UI)[keyof typeof FLAGS.UI];

export const useFeature = (key: FlagKeys, defaultValue: boolean = false) => {
  const variable = useVariableValue(key, defaultValue);

  return variable;
};
