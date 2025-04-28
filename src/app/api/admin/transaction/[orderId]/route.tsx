import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
   var session = await getServerSession(authOptions);

   var payment = await prisma.payments.findFirst({
      where: {
         orderId: params.orderId,
      },
      select: {
         amount: true,
         orderId: true,
         paymentType: true,
         link: true,
         Shipment: {
            select: {
               price: true,
               trackingId: true,
               couriers: {
                  select: {
                     name: true,
                     company: true,
                  },
               },
               updatedAt: true,
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
                     priceIDR: true,
                     subDescriptions: true,
                     image1: true,
                     Discount: {
                        select: {
                           discount: true,
                           startDate: true,
                           endDate: true,
                           productPrice: true,
                        },
                     },
                  },
               },
               user: {
                  select: {
                     id: true,
                     name: true,
                     address: true,
                  },
               },
            },
         },
      },
   });

   return NextResponse.json({
      error: false,
      message: null,
      data: payment,
   });
}
