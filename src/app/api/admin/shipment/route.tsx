import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   var find = request.nextUrl.searchParams.get("find")?.trim();
   var page = request.nextUrl.searchParams.get("page")!;
   var pageSize = request.nextUrl.searchParams.get("pageSize")!;

   var params = {};
   if (params != "undifined" || params != null || params != undefined) {
      params = {
         shipmentCode: {
            contains: find,
         },
      };
   }

   var data = await prisma.shipment.findMany({
      where: {
         ...params,
      },
      take: parseInt(pageSize),
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      orderBy: {
         createdAt: "desc",
      },
   });
   var count = await prisma.shipment.count({
      where: {
         ...params,
      },
   });
   var payload = {
      data: data,
      count: count,
   };
   return NextResponse.json({
      error: false,
      message: null,
      data: payload,
   });
}
