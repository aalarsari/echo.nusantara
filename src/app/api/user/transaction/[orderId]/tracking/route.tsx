import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { TrackingData } from "@/lib/shipment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
   var session = await getServerSession(authOptions);
   // get shipment
   const payment = await prisma.payments.findFirst({
      where: {
         userId: parseInt(session?.user.userId!),
         orderId: params.orderId,
         status: "SUCCESS",
         transaction: {
            some: {
               status: "PROCESS",
            },
         },
      },
      select: {
         Shipment: {
            select: {
               trackingId: true,
            },
         },
      },
   });
   if (!payment || !payment?.Shipment) {
      return NextResponse.json(
         {
            error: true,
            message: "Order id not found",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }
   // get Tracking

   if (payment?.Shipment?.trackingId != null) {
      var tracking = await TrackingData(payment?.Shipment.trackingId!);
   } else {
      return NextResponse.json(
         {
            error: true,
            message: "Please pay for your purchase to continue tracking",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }

   return NextResponse.json({
      error: false,
      message: null,
      data: tracking!,
   });
}
