import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const data = request.nextUrl.searchParams.get("data"); // <- bait request biar jadi dynamic
   var category = await prisma.categoryBlog.findMany({
      select: {
         name: true,
         isRecomended: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: category,
   });
}
