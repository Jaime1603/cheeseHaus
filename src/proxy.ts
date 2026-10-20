import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/registro");



  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    
 
    if (req.auth?.user?.rol !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    } 
  }
if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
