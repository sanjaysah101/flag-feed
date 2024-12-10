import { useVariable } from "@devcycle/nextjs-sdk";

export const useFeature = (key: string, defaultValue: boolean = false) => {
  const { value } = useVariable(key, defaultValue);
  return value as boolean;
};
