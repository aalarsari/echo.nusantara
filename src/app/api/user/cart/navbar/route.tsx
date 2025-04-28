import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { cartValidtion } from "@/lib/zod-schema/cart";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { totalHarga } from "@/lib/totalCart/totalCart";
import moment from "moment-timezone";

export async function GET(request: NextRequest) {
   const session = await getServerSession(authOptions);
   var carts = await prisma.cart.findMany({
      where: {
         userId: parseInt(session?.user.userId!),
         isCheckOut: false,
         isBuyNow: false,
      },
      select: {
         id: true,
         buyQuantity: true,
         product: {
            select: {
               id: true,
               name: true,
               slug: true,
               image1: true,
               descriptions: true,
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
   });

   var total = totalHarga(carts);

   var data = {
      count: carts.length,
      cart: carts ?? null,
      total: total ?? null,
   };

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
