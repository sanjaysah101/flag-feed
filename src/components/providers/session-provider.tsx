"use client";

import { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export const SessionProvider = ({ children, session }: { children: React.ReactNode; session: Session }) => {
  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>;
};
