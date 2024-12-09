import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const protectPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return session;
};
