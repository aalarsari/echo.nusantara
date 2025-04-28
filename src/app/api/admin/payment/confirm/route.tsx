import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { ConfirmDraftShipment } from "@/lib/shipment";
import { confirmTransactionValidation } from "@/lib/zod-schema/transaction";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";
import { SendEmail } from "@/lib/mail/email";
import Nota from "@/lib/mail/template/nota";
import { render } from "@react-email/components";

export async function POST(request: NextRequest) {
   var body = await request.json();
   var session = await getServerSession(authOptions);
   var validation = confirmTransactionValidation.safeParse(body);
   const data = validation.data;
   if (validation.error) {
      const validationError = fromZodError(validation.error);
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
   var transaction = await prisma.transactions.findMany({
      where: {
         payment: {
            orderId: data?.orderId,
            status: "SUCCESS",
         },
         status: "PAID",
      },
      include: {
         payment: true,
         user: true,
      },
   });

   if (transaction.length < 1) {
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

   await prisma.transactions.updateMany({
      where: {
         paymentId: transaction[0].paymentId,
      },
      data: {
         status: "PROCESS",
         updateAt: moment.tz().format(),
         updateBy: session?.user.name,
      },
   });
   var shipment = await prisma.shipment.findFirst({
      where: {
         paymentsId: transaction[0].payment.id,
      },
   });
   if (!shipment) {
      return NextResponse.json(
         {
            error: true,
            message: "Cannot continue this action",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }
   await ConfirmDraftShipment(shipment?.shipmentCode!);

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
         data: null,
      },
      { status: HttpStatusCode.OK },
   );
}
