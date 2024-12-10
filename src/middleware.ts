import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const authCookie = request.cookies.get(
    process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token"
  );

  if (!authCookie) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/feeds/:path*", "/profile/:path*", "/learn/:path*"],
};
