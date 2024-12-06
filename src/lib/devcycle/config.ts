import { setupDevCycle } from "@devcycle/nextjs-sdk/server";

import { getCurrentUser } from "../auth/utils";

const getUserIdentity = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return {
      isAnonymous: true,
      user_id: "anonymous",
    };
  }

  return {
    user_id: user.id,
    email: user.email || undefined,
    name: user.name || undefined,
    customData: {
      // Add any custom data here
    },
  };
};

export const { getVariableValue, getClientContext } = setupDevCycle({
  // Server SDK Key for configuration data
  serverSDKKey: process.env.NEXT_PUBLIC_DEVCYCLE_SERVER_SDK_KEY ?? "",
  // Client SDK Key for client-side usage
  clientSDKKey: process.env.NEXT_PUBLIC_DEVCYCLE_CLIENT_SDK_KEY ?? "",
  userGetter: getUserIdentity,
  options: {
    // Enable for streaming with Suspense
    enableStreaming: true,
  },
});
