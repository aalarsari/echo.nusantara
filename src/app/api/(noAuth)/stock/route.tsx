import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const id = request.nextUrl.searchParams.get("productId");
   var product = await prisma.products.findFirst({
      where: {
         id: parseInt(id!),
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: product?.stock,
   });
}
