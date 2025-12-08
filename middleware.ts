import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const { auth } = req;

  // If the user is an admin and is on the home page, redirect to /admin
  if (auth && auth.user?.role === "ADMIN" && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (auth && auth.user?.role === "REVIEWER" && pathname === "/") {
    return NextResponse.redirect(new URL("/review", req.url));
  }

  // If the user is a submitter and is on the home page, redirect to /submit
  if (auth && auth.user?.role === "SUBMITTER" && pathname === "/") {
    return NextResponse.redirect(new URL("/submit", req.url));
  }

  // If the user is trying to access an admin route and is not an admin, redirect to /signin
  if (pathname.startsWith("/admin") && (!auth || auth.user?.role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is trying to access a review route and is not a REVIEWER, redirect to /
  if (
    pathname.startsWith("/review") &&
    (!auth || auth.user?.role !== "REVIEWER")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is trying to access a submit route and is not an ADMIN or SUBMITTER, redirect to /
  if (
    pathname.startsWith("/submit") &&
    (!auth || (auth.user?.role !== "ADMIN" && auth.user?.role !== "SUBMITTER"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Run the middleware on all routes except for API routes, static files, and image optimization files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
