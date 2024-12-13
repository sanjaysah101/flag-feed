"use client";

import { Progress } from "../ui/progress";

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
}

export const ProgressBar = ({ current, max, label }: ProgressBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {current}/{max}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};
