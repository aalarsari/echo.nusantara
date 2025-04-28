import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   var page = request.nextUrl.searchParams.get("page")!;
   var pageSize = request.nextUrl.searchParams.get("pageSize")!;
   var couriers = await prisma.couriers.findMany({
      where: {
         isActive: true,
      },
      take: parseInt(pageSize),
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      orderBy: {
         createdAt: "desc",
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: couriers,
   });
}
