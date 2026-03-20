import { NextResponse } from "next/server";

// Simple middleware that checks for session cookie existence
// Actual session validation happens in page components and API routes
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public paths that do not require authentication
  const publicPaths = ["/", "/auth/login", "/auth/register"];
  const isPublicPath = publicPaths.some(path => pathname === path);
  
  // Static files and API routes should pass through
  if (pathname.startsWith("/_next") || 
      pathname.startsWith("/api") || 
      pathname.includes(".") ||
      pathname === "/favicon.ico") {
    return NextResponse.next();
  }
  
  // Get session token from cookie
  const token = request.cookies.get("session_token")?.value;
  
  // If no token and trying to access protected page, redirect to login
  if (!token && !isPublicPath) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  
  // If has token and trying to access auth pages, redirect to dashboard
  if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
