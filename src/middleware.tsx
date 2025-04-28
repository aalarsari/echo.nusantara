import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { getCsrfToken } from "next-auth/react";
import { SingleDeviceLogin } from "./lib/nextAuth/SDL";
import { $Enums } from "@prisma/client";
import { is } from "date-fns/locale";

export default async function middleware(req: NextRequestWithAuth, event: NextFetchEvent) {
   const token = await getToken({ req });
   const isAuthenticated = !!token;

   const roleCanAccessAdmin: $Enums.Role[] = ["ADMIN", "SALES", "LOGISTIC", "SUPER_ADMIN"];


   if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
   }

   if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/api/admin")) {
      if (isAuthenticated && !roleCanAccessAdmin.includes(token?.role as $Enums.Role)) {
         return NextResponse.redirect(new URL("/not-found", req.url));
      }
   } else if (req.nextUrl.pathname.startsWith("/api/user")) {
      if (isAuthenticated && token!.role !== "USER") {
         return NextResponse.redirect(new URL("/login", req.url));
      }
   }
   const authMiddleware = withAuth({
      pages: {
         signIn: `/login`,
      },
   });

   return authMiddleware(req, event);
}

export const config = {
   matcher: ["/dashboard/:path*", "/api/admin/:path*", "/api/user/:path*", "/login", "/pdf"],
};
