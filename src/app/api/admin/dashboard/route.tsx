import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";
import prisma from "@/database/prisma";
import { HttpStatusCode } from "axios";
import { fromZodError } from "zod-validation-error";
import { grafikValidation, topSellerValidation } from "@/lib/zod-schema/dashboard";
import { DashboardModel, model } from "@/types/dashboard/dashboard";

export async function GET(request: NextRequest) {
   const topSallerParams = request.nextUrl.searchParams.get("topSaller");
   const grafikParams = request.nextUrl.searchParams.get("grafik");
   const year = request.nextUrl.searchParams.get("year");

   const models: model[] = [];
   const date = year == "" || year == null ? moment.tz("Asia/Jakarta") : moment.tz("Asia/Jakarta").year(parseInt(year));
   var totalRevanue = 0;
   var sumItemSold = 0;
   var totalOrder = 0;
   var model: model;
   var totalCostumer = 0;

   const topSellerValidationData = topSellerValidation.safeParse(topSallerParams);

   const grafikValidationData = grafikValidation.safeParse(grafikParams);

   if (topSellerValidationData.error || grafikValidationData.error) {
      const validationError = fromZodError(topSellerValidationData.error! ?? grafikValidationData.error!);
      return NextResponse.json(
         {
            error: true,
            message: null,
            data: validationError,
         },
         {
            status: HttpStatusCode.UnprocessableEntity,
         },
      );
   }

   const topSaller = topSellerValidationData.data;
   const grafik = grafikValidationData.data;
   for (let i = 0; i < 12; i++) {
      var startDate = date.clone().month(i).startOf("month").format();
      var endDate = date.clone().month(i).endOf("month").format();
      let getDataPayment = await prisma.payments.findMany({
         where: {
            transaction: {
               some: {
                  status: {
                     in: ["DONE", "PAID", "PROCESS"],
                  },
               },
            },
            updatedAt: {
               gte: startDate,
               lte: endDate,
            },
         },
         select: {
            amount: true,
         },
      });

      let getDataTransaction = await prisma.transactions.findMany({
         where: {
            status: {
               in: ["DONE", "PAID", "PROCESS"],
            },
            updateAt: {
               gte: startDate,
               lte: endDate,
            },
         },
         select: {
            quantity: true,
         },
      });

      var totalCostumerPerbulan = await prisma.user.count({
         where: {
            createdAt: {
               gte: startDate,
               lte: endDate,
            },
         },
      });

      var totalPerBulanRevanue = getDataPayment.reduce((sum, item) => {
         return sum + item.amount;
      }, 0);

      var totalItemPerBulan = getDataTransaction.reduce((sum, item) => {
         return sum + item.quantity;
      }, 0);
      if (grafik == "Revenue") {
         model = {
            type: grafik,
            total: totalPerBulanRevanue,
            mounth: i + 1,
         };
      } else if (grafik == "Items Sold") {
         model = {
            type: grafik,
            total: totalItemPerBulan,
            mounth: i + 1,
         };
      } else if (grafik == "Total Orders") {
         model = {
            type: grafik,
            total: getDataPayment.length,
            mounth: i + 1,
         };
      } else {
         model = {
            type: grafik,
            total: totalCostumerPerbulan,
            mounth: i + 1,
         };
      }

      totalRevanue = totalRevanue + totalPerBulanRevanue;
      sumItemSold = sumItemSold + totalItemPerBulan;
      totalOrder = totalOrder + getDataPayment.length;
      totalCostumer = totalCostumer + totalCostumerPerbulan;

      models.push(model);
   }

   var lastBuyer = await prisma.payments.findMany({
      select: {
         orderId: true,
         amount: true,

         transaction: {
            select: {
               quantity: true,
               products: {
                  select: {
                     name: true,
                  },
               },
            },
         },
         user: {
            select: {
               name: true,
            },
         },
      },
      orderBy: {
         updatedAt: "asc",
      },
      take: 5,
   });

   var quary = {
      updateAt: {
         gte: date.clone().startOf(topSaller).toDate(),
         lte: date.clone().endOf(topSaller).toDate(),
      },
   };

   var itemSoldTopSeller = await prisma.transactions.findMany({
      where: {
         status: {
            in: ["DONE", "PAID", "PROCESS"],
         },
         ...quary,
      },
      select: {
         quantity: true,
         products: {
            select: {
               id: true,
               name: true,
               priceIDR: true,
               image1: true,
            },
         },
      },
   });

   var sumFilterItemSold = itemSoldTopSeller.reduce((acc: { [key: number]: typeof item }, item) => {
      if (acc[item.products.id]) {
         acc[item.products.id].quantity += item.quantity;
      } else {
         acc[item.products.id] = { ...item };
      }
      return acc;
   }, {});

   var valueObjectSumFilterItemSold = Object.values(sumFilterItemSold);

   const topSeller = valueObjectSumFilterItemSold.sort((a, b) => b.quantity - a.quantity).slice(0, 3);

   var data: DashboardModel = {
      cartModel: models,
      totalRevanue: totalRevanue,
      totalOrder: totalOrder,
      totalCostumer: totalCostumer,
      totalItemSold: sumItemSold,
      recentOrder: lastBuyer,
      topSaller: topSeller,
   };
   return NextResponse.json({
      error: true,
      message: null,
      data: data,
   });
}
