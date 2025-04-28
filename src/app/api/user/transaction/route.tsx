import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { $Enums, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET(request: NextRequest) {
   var session = await getServerSession(authOptions);

   var orderBy = request.nextUrl.searchParams.get("filterBy")?.trim();
   var filterWith = request.nextUrl.searchParams.get("filterWith")?.trim();

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
   const defaultOrderby: Prisma.PaymentsOrderByWithAggregationInput = {
      updatedAt: "desc",
   };

   var transactionStatus: string[] = [
      $Enums.TransactionsStatus.NEW,
      $Enums.TransactionsStatus.PAID,
      $Enums.TransactionsStatus.PROCESS,
      $Enums.TransactionsStatus.DECLINE,
      $Enums.TransactionsStatus.DONE,
      $Enums.TransactionsStatus.REFUND,
      "ALL",
   ];

   var orderDirection: string[] = ["asc", "desc"];

   const filter = { [orderBy as string]: filterWith };
   if (orderBy != "" && filter.status) {
      if (!transactionStatus.includes(filter.status)) {
         return NextResponse.json(
            {
               error: true,
               message: "Invalid Transcation Status",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
   } else if (orderBy != "" && (filter.id || filter.createdAt || filter.updatedAt)) {
      if (filter.id && !orderDirection.includes(filter.id!)) {
         return NextResponse.json(
            {
               error: true,
               message: "Invalid Order Direction id",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      } else if (filter.createdAt && !orderDirection.includes(filter.createdAt!)) {
         return NextResponse.json(
            {
               error: true,
               message: "Invalid Order Direction createdAt",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      } else if (filter.updatedAt && !orderDirection.includes(filter.updatedAt!)) {
         return NextResponse.json(
            {
               error: true,
               message: "Invalid Order Direction updatedAt ",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
   }

   var payment = await prisma.payments.findMany({
      where: {
         userId: parseInt(session?.user?.userId!),
         transaction: {
            some: {
               ...(orderBy === "status" && filter.status?.length! > 0 ? (filter.status == "ALL" ? undefined : filter) : undefined),
            },
         },
         createdAt:
            startDate != null
               ? {
                    gte: startDate,
                    lte: endDate,
                 }
               : undefined,
      },
      select: {
         id: true,
         status: true,
         amount: true,
         orderId: true,
         createdAt: true,
         updatedAt: true,
         paymentType: true,
         
         link: true,
         Shipment: {
            select: {
               price: true,
               couriers: {
                  select: {
                     name: true,
                     company: true,
                  },
               },
               updatedAt: true,
            },
         },
         user: {
            select: {
               name: true,
            },
         },
         transaction: {
            select: {
               quantity: true,
               status: true,
               createdAt: true,
               products: {
                  select: {
                     id: true,
                     name: true,
                     image1: true,
                     priceIDR: true,
                     Discount: {
                        where: {
                           startDate: {
                              lte: moment().format(),
                           },
                           endDate: {
                              gte: moment().format(),
                           },
                        },
                     },
                  },
               },
            },
         },
      },
      orderBy: {
         ...((orderBy === "id" || orderBy == "createdAt" || orderBy === "updatedAt") && (filter.id?.length! > 0 || filter.createdAt?.length! > 0 || filter.updatedAt?.length! > 0)
            ? filter
            : defaultOrderby),
      },
      take: pageSizeInt,
      skip: (page - 1) * pageSize,
   });

   var count = await prisma.payments.count({
      where: {
         userId: parseInt(session?.user?.userId!),
         transaction: {
            some: {
               ...(orderBy === "status" && filter.status?.length! > 0 ? (filter.status == "ALL" ? undefined : filter) : undefined),
            },
         },
         createdAt:
            startDate != null
               ? {
                    gte: startDate,
                    lte: endDate,
                 }
               : undefined,
      },

      orderBy: {
         ...((orderBy === "id" || orderBy == "createdAt" || orderBy === "updatedAt") && (filter.id?.length! > 0 || filter.createdAt?.length! > 0 || filter.updatedAt?.length! > 0)
            ? filter
            : defaultOrderby),
      },
   });

   return NextResponse.json({
      error: false,
      message: null,
      data: {
         payment: payment,
         count: count,
      },
   });
}
