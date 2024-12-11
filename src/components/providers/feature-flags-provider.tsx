import { DevCycleClientsideProvider } from "@devcycle/nextjs-sdk";

import { getClientContext } from "@/lib/devcycle/config";

export const FeatureFlagsProvider = ({ children }: { children: React.ReactNode }) => {
  return <DevCycleClientsideProvider context={getClientContext()}>{children}</DevCycleClientsideProvider>;
};
