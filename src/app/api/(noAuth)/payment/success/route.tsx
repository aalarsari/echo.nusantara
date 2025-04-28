import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { GetDetailPaymentCashlezz } from "@/lib/payment";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import moment from "moment-timezone";
import { SendEmail } from "@/lib/mail/email";
import Nota from "@/lib/mail/template/nota";
import { render } from "@react-email/components";

export async function GET(request: NextRequest) {
   const orderId = request.nextUrl.searchParams.get("orderId");
   const token = request.nextUrl.searchParams.get("token");

   if (!orderId) {
      return NextResponse.json(
         {
            error: true,
            message: "orderId is required",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }
   //check payment
   const payment = await prisma.payments.findFirst({
      where: {
         orderId: orderId!,
         tokenSuccess: token,
      },
   });
   if (!payment) {
      const logDirectory = path.join("./logs");
      const filePath = path.join(logDirectory, "payment-log.log");
      const flagNew = { flag: "wx" };

      // Create the directory if it doesn't exist
      if (!fs.existsSync(logDirectory)) {
         fs.mkdirSync(logDirectory, { recursive: true });
      }
      const message = `[${moment.tz().format()}] ${orderId} tidak ditemukan }`;
      if (!fs.existsSync(filePath)) {
         fs.writeFileSync(filePath, message, flagNew);
      } else {
         fs.appendFileSync(filePath, message);
      }
      return NextResponse.json(
         {
            error: true,
            message: message,
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }
   const data = await GetDetailPaymentCashlezz(payment?.link!);

   await prisma.payments.update({
      where: {
         orderId: orderId!,
         tokenSuccess: token,
      },
      data: {
         status: "SUCCESS",
         updatedAt: moment.tz().format(),
         paymentType: data.data.response.paymentType.name,
      },
   });

   await prisma.transactions.updateMany({
      where: {
         paymentId: payment.id,
      },
      data: {
         status: "PAID",
      },
   });

   const transaction = await prisma.transactions.findMany({
      where: {
         paymentId: payment.id,
      },
      include: {
         payment: true,
         user: true,
      },
   });

   await SendEmail({
      to: transaction[0].user!.email,
      subject: `invoice payment ${payment.orderId}`,
      html: render(
         Nota({
            orderId: payment?.orderId!,
            id: payment?.id!,
            amount: payment?.amount!,
            status: payment?.status!,
            createdAt: payment?.createdAt!,
            updatedAt: payment?.updatedAt!,
            user: transaction[0].user!,
            transaction: transaction,
         }),
      ),
   });

   return NextResponse.redirect(`${process.env.APP_URL}/profile?menu=My-Orders`);
}
