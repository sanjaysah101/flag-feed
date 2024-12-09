import { User } from "@prisma/client";

import { auth } from "@/auth";

export const getCurrentUser = async (): Promise<User | null> => {
  const session = await auth();
  return session?.user as User | null;
};
