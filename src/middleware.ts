export { auth as middleware } from "@/auth";

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
