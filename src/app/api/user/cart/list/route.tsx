import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { totalHarga } from "@/lib/totalCart/totalCart";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   var cartIds = request.nextUrl.searchParams.getAll("cartId")!;
   const session = await getServerSession(authOptions);

   var carts = await prisma.cart.findMany({
      where: {
         id: { in: cartIds.map((value) => parseInt(value)) },
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
