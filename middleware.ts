import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  let role: string | null = null;
  try {
    const decoded = decodeJwt(token) as { role?: string };
    role = decoded.role || null;
  } catch {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  const pathname = req.nextUrl.pathname;

  // User routes accessible by "user", "admin", or "owner"
  if (
    pathname.startsWith("/user") &&
    !["user", "admin", "owner"].includes(role!)
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && role !== "owner") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
