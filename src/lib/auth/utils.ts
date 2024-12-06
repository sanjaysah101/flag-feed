import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth.config";

export const getSession = async () => {
  return await getServerSession(authOptions);
};

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user;
};
