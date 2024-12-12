import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";

import { prisma } from "@/lib/db/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          points: 0,
          streak: 0,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => {
      if (session?.user) {
        session.user.id = user.id!;
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: { points: true },
        });
        session.user.points = userData?.points || 0;
      }
      return session;
    },
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};
