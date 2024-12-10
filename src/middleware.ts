import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const authCookie = request.cookies.get("next-auth.session-token");

  if (!authCookie) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/feeds/:path*",
    "/profile/:path*",
    "/learn/:path*",
    // Exclude
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
