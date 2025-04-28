import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import moment from "moment-timezone";
import { UpdateStatusShipment } from "@/lib/shipment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { SendEmail } from "@/lib/mail/email";
import Nota from "@/lib/mail/template/nota";
import { render } from "@react-email/components";

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
   var session = await getServerSession(authOptions);
   var checkTranscation = await prisma.transactions.findMany({
      where: {
         userId: parseInt(session?.user.userId!),
         payment: {
            orderId: params.orderId,
         },
         status: "PROCESS",
      },
      include: {
         user: true,
         payment: true,
      },
   });
   if (checkTranscation.length < 0) {
      return NextResponse.json(
         {
            error: true,
            message: "data not found",
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
            orderId: params.orderId,
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
            orderId: params.orderId,
         },
      },
   });
   await UpdateStatusShipment(shipment?.shipmentCode!);

   await SendEmail({
      to: checkTranscation[0].user!.email,
      subject: `invoice payment ${checkTranscation[0].payment.orderId}`,
      html: render(
         Nota({
            orderId: checkTranscation[0].payment?.orderId!,
            id: checkTranscation[0].payment?.id!,
            amount: checkTranscation[0].payment?.amount!,
            status: checkTranscation[0].payment?.status!,
            createdAt: checkTranscation[0].payment?.createdAt!,
            updatedAt: checkTranscation[0].payment?.updatedAt!,
            user: checkTranscation[0].user!,
            transaction: checkTranscation,
         }),
      ),
   });
   return NextResponse.json(
      {
         error: false,
         message: "transaction status updated ",
         data: update,
      },
      {
         status: HttpStatusCode.OK,
      },
   );
}
