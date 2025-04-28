import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   var couriers = await prisma.couriers.findMany({
      where: {
         isActive: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: couriers,
   });
}
