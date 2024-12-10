"use client";

import { useAllVariables } from "@devcycle/nextjs-sdk";

import { useFeature } from "@/hooks/useFeature";
import { FLAGS } from "@/lib/devcycle/flags";

const FlagIndicator = ({ enabled, label }: { enabled: boolean; label: string }) => (
  <div className="flex items-center gap-2">
    <span className={`h-2 w-2 rounded-full ${enabled ? "bg-green-500" : "bg-red-500"}`} />
    <span>
      {label}: {enabled ? "Enabled" : "Disabled"}
    </span>
  </div>
);

export const FeatureFlags = () => {
  const hasPointBoost = useFeature(FLAGS.GAMIFICATION.POINT_BOOST);
  const allVariables = useAllVariables();
  // eslint-disable-next-line no-console
  console.log({ hasPointBoost, allVariables });

  return (
    <div className="rounded-lg border p-4">
      <pre>{JSON.stringify(allVariables, null, 2)}</pre>;<h2 className="mb-4 text-xl font-bold">Feature Flag Status</h2>
      <div className="space-y-2">
        {Object.entries(allVariables).map(([key, variable]) => (
          <FlagIndicator enabled={variable.value as boolean} label={key} key={key} />
        ))}
      </div>
    </div>
  );
};
