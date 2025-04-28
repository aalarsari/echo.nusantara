import prisma from "@/database/prisma";
import { TrackingData } from "@/lib/shipment";
import { $Enums, Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   var filterBy = request.nextUrl.searchParams.get("filterBy")?.trim();
   var filterWith = request.nextUrl.searchParams.get("filterWith")?.trim();

   var searchP = request.nextUrl.searchParams.get("search")?.trim();

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
      updatedAt: "asc",
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

   var search: any = {
      OR: [
         {
            user: {
               name: {
                  contains: searchP,
                  mode: "insensitive",
               },
            },
         },
         {
            orderId: {
               contains: searchP,
               mode: "insensitive",
            },
         },
      ],
   };
   if (searchP?.length == 0 || searchP == "undifined" || searchP == null || searchP == undefined) {
      search = {};
   }
   const filter = { [filterBy as string]: filterWith };

   if (filterBy != "" && filter.status) {
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
   } else if (filterBy != "" && (filter.id || filter.createdAt || filter.updatedAt)) {
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
         status: {
            notIn: ["DECLINE", "PENDING"],
         },
         transaction: {
            some: {
               ...(filterBy === "status" && filter.status?.length! > 0 ? (filter.status == "ALL" ? undefined : filter) : undefined),
            },
         },
         createdAt:
            startDate != null
               ? {
                    gte: startDate,
                    lte: endDate,
                 }
               : undefined,
         ...search,
      },
      select: {
         id: true,
         status: true,
         amount: true,
         orderId: true,

         user: {
            select: {
               name: true,
               address: true,
               phone: true,
            },
         },
         createdAt: true,
         updatedAt: true,
         Shipment: {
            select: {
               trackingId: true,
               shipmentCode: true,
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
                  },
               },
            },
         },
      },
      orderBy: {
         ...((filterBy === "id" || filterBy == "createdAt" || filterBy === "updatedAt") &&
         (filter.id?.length! > 0 || filter.createdAt?.length! > 0 || filter.updatedAt?.length! > 0)
            ? filter
            : defaultOrderby),
      },
      take: pageSizeInt,
      skip: (page - 1) * pageSize,
   });

   const trackingPromises = payment.map(async (value) => {
      try {
         let trackingLink;
         if (value.Shipment?.trackingId != null) {
            const res = await TrackingData(value?.Shipment.trackingId!);
            trackingLink = res?.link || null;
         } else {
            trackingLink = null;
         }
         return {
            orderId: value.orderId,
            trackingLink: trackingLink,
         };
      } catch (error) {
         return {
            orderId: value.orderId,
            trackingLink: null,
         };
      }
   });
   const tracking = await Promise.all(trackingPromises);

   var count = await prisma.payments.count({
      where: {
         status: {
            notIn: ["DECLINE", "PENDING"],
         },
         transaction: {
            some: {
               ...(filterBy === "status" && filter.status?.length! > 0 ? (filter.status == "ALL" ? undefined : filter) : undefined),
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
         ...((filterBy === "id" || filterBy == "createdAt" || filterBy === "updatedAt") &&
         (filter.id?.length! > 0 || filter.createdAt?.length! > 0 || filter.updatedAt?.length! > 0)
            ? filter
            : defaultOrderby),
      },
   });

   return NextResponse.json({
      error: false,
      message: null,
      data: {
         payment: payment,
         tracking: tracking,
         count: count,
      },
   });
}
