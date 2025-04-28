import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   var session = request.nextUrl.searchParams.get("sessionId");

   if (!session) {
      return NextResponse.json(
         {
            error: false,
            message: "Unauthorized",
            data: null,
         },
         {
            status: HttpStatusCode.Unauthorized,
         },
      );
   }
   var data = await prisma.session.findFirst({
      where: {
         sessionToken: session!,
      },
   });

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
