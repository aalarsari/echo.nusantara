import prisma from "@/database/prisma";
import moment from "moment-timezone";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { UpdateStatusShipment } from "@/lib/shipment";
import { confirmTransactionValidation } from "@/lib/zod-schema/transaction";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { SendEmail } from "@/lib/mail/email";
import { render } from "@react-email/components";
import Nota from "@/lib/mail/template/nota";

export async function POST(request: NextRequest) {
   var body = await request.json();
   var session = await getServerSession(authOptions);
   try {
      var validation = confirmTransactionValidation.parse(body);
      var transaction = await prisma.transactions.findMany({
         where: {
            payment: {
               orderId: validation.orderId,
               status: "SUCCESS",
            },
            status: "PROCESS",
         },
         include: {
            user: true,
            payment: true,
         },
      });
      if (!transaction) {
         return NextResponse.json(
            {
               error: true,
               message: "Order Id not found",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
      var update = await prisma.transactions.updateMany({
         where: {
            payment: {
               orderId: validation.orderId,
            },
            status: "PROCESS",
         },
         data: {
            status: "DONE",
            updateAt: moment.tz().format(),
            updateBy: session?.user.name,
         },
      });
      var shipment = await prisma.shipment.findFirst({
         where: {
            payment: {
               orderId: validation.orderId,
            },
         },
      });

      await UpdateStatusShipment(shipment?.shipmentCode!);
      await SendEmail({
         to: transaction[0].user!.email,
         subject: `invoice payment ${transaction[0].payment.orderId}`,
         html: render(
            Nota({
               orderId: transaction[0].payment?.orderId!,
               id: transaction[0].payment?.id!,
               amount: transaction[0].payment?.amount!,
               status: transaction[0].payment?.status!,
               createdAt: transaction[0].payment?.createdAt!,
               updatedAt: transaction[0].payment?.updatedAt!,
               user: transaction[0].user!,
               transaction: transaction,
            }),
         ),
      });
      return NextResponse.json(
         {
            error: false,
            message: "transaction status updated ",
            data: update,
         },
         { status: HttpStatusCode.OK },
      );
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
