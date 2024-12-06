import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/auth/signin",
  },
});

// Protect all routes under /dashboard, /feeds, /profile, and /learn
export const config = {
  matcher: ["/dashboard/:path*", "/feeds/:path*", "/profile/:path*", "/learn/:path*"],
};
