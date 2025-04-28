import prisma from "@/database/prisma";
import moment from "moment-timezone";
import { authOptions } from "@/lib/nextAuth/auth";
import { UpdateStatusShipment } from "@/lib/shipment";
import { ShipmentUpdateValidation } from "@/lib/zod-schema/shipment";
import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function GET(request: NextRequest, { params }: { params: { shipmentCode: string } }) {
   var shipmentCode = params.shipmentCode;
   var payload = await prisma.shipment.findFirst({
      where: {
         shipmentCode: shipmentCode,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: payload,
   });
}

export async function PUT(request: NextRequest, { params }: { params: { shipmentCode: string } }) {
   var shipmentCode = params.shipmentCode;
   var session = await getServerSession(authOptions);
   var body = await request.json();
   try {
      var validation = ShipmentUpdateValidation.parse(body);
      if (!validation.status) {
         var shipmentData = await UpdateStatusShipment(shipmentCode);
      } else {
         var shipment = await prisma.shipment.findFirst({
            where: {
               shipmentCode: shipmentCode,
            },
         });
         var data = await prisma.shipment.update({
            where: {
               id: shipment?.id,
            },
            data: {
               status: validation.status,
               updatedAt: moment.tz().format(),
               updatedBy: session?.user.name!,
            },
         });
      }
      return NextResponse.json({
         error: false,
         message: null,
         data: shipmentData! ?? data!,
      });
   } catch (err) {
      if (err instanceof z.ZodError) {
         const validationError = fromZodError(err);
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
      } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
         return NextResponse.json(
            {
               error: true,
               message: null,
               data: err,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
   }
}
