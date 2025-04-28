import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   var getData = await prisma.couriers.findFirst({
      where: {
         id: parseInt(params.id),
      },
   });
   var couriers = await prisma.couriers.update({
      where: {
         id: getData?.id!,
      },
      data: {
         isActive: !getData?.isActive,
      },
   });
   return NextResponse.json({
      error: false,
      message: "couriers updated successfully",
      data: couriers,
   });
}
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
   var couriers = await prisma.couriers.findFirst({
      where: {
         id: parseInt(params.id),
      },
   });

   return NextResponse.json({
      error: false,
      message: null,
      data: couriers,
   });
}
