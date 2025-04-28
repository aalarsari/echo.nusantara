import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } },
) {
  var session = await getServerSession(authOptions);

  var payment = await prisma.payments.findFirst({
    where: {
      orderId: params.orderId,
      userId: parseInt(session?.user?.userId!),
    },
    select: {
      amount: true,
      orderId: true,
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
              image1: true,
              Discount: {
                where: {
                  startDate: {
                    lte: moment().format(),
                  },
                  endDate: {
                    gte: moment().format(),
                  },
                },
                select: {
                  discount: true,
                  startDate: true,
                  productPrice: true,
                  endDate: true,
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
