import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   var data = await prisma.socialMedia.findMany({
      where: {
         isActive: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: {
         socialMedia: data,
         count: data.length,
      },
   });
}

