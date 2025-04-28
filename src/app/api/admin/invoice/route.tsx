import prisma from "@/database/prisma";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   var startDateString = request.nextUrl.searchParams.get("startDate");
   var endDateString = request.nextUrl.searchParams.get("endDate");

   var page: any = request.nextUrl.searchParams.get("page")!;
   var pageSize: any = request.nextUrl.searchParams.get("pageSize");
   var pageSizeInt = parseInt(pageSize);

   var startDate;
   var endDate;
   if (startDateString) {
      startDate = moment(startDateString!).startOf("days").toDate();
   }
   if (endDateString) {
      endDate = moment(endDateString!).endOf("days").toDate();
   }
   var payment = await prisma.payments.findMany({
      where: {
         status: "SUCCESS",
         ...(startDate! != null && endDate! != null
            ? {
                 createdAt: {
                    gte: startDate,
                    lte: endDate,
                 },
              }
            : {}),
      },
      select: {
         transaction: {
            select: {
               quantity: true,
               status: true,
               createdAt: true,
            },
         },
         amount: true,
         orderId: true,
      },
      take: pageSizeInt,
      skip: (page - 1) * pageSize,
   });

   var total = 0;
   for (let i = 0; i < payment.length; i++) {
      total += payment[i].amount;
   }
   var data = {
      payment: payment,
      total: total,
   };

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
