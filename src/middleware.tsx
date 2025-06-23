import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

import { $Enums } from "@prisma/client";

// 1. Setup middleware i18n dulu
const intlMiddleware = createIntlMiddleware(routing);

// 2. Middleware utama gabungan
export default async function middleware(req: NextRequest) {
  // Jalankan i18n middleware dulu
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  // Ambil token user
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  const roleCanAccessAdmin: $Enums.Role[] = [
    "ADMIN",
    "SALES",
    "LOGISTIC",
    "SUPER_ADMIN",
  ];

  const url = req.nextUrl.clone();

  // Redirect jika user sudah login tapi akses /login
  if (url.pathname.startsWith("/login") && isAuthenticated) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Admin check
  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/api/admin")
  ) {
    if (
      isAuthenticated &&
      !roleCanAccessAdmin.includes(token?.role as $Enums.Role)
    ) {
      url.pathname = "/not-found";
      return NextResponse.redirect(url);
    }
  }

  // User check
  if (url.pathname.startsWith("/api/user")) {
    if (isAuthenticated && token?.role !== "USER") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Default: teruskan request
  return NextResponse.next();
}

// Gabungkan matcher
export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)", // i18n
    "/dashboard/:path*",
    "/api/admin/:path*",
    "/api/user/:path*",
    "/login",
    "/pdf",
  ],
};
