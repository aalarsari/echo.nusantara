import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import moment from "moment-timezone";
import { GetDetailPaymentCashlezz } from "@/lib/payment";
import { $Enums } from "@prisma/client";
import { SendEmail } from "@/lib/mail/email";
import { render } from "@react-email/components";
import Nota from "@/lib/mail/template/nota";

export async function GET(request: NextRequest) {
   var session = await getServerSession(authOptions);
   const logDirectory = path.join("./logs");
   const filePath = path.join(logDirectory, "cron-log.log");
   // Create the directory if it doesn't exist
   if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
   }

   var header = {
      authorization: process.env.BITSHIP_TOKEN_API!,
      "content-type": "application/json",
   };

   var data = await prisma.payments.findMany({
      where: {
         status: "PENDING",
      },
      select: {
         id: true,
         link: true,
         orderId: true,
      },
   });
   const flagNew = { flag: "wx" };
   data.forEach(async (value, index) => {
      const res = await GetDetailPaymentCashlezz(value?.link!);

      if (res.data.response.processStatus == "APPROVED") {
         const update = await prisma.payments.update({
            where: {
               id: value.id,
            },
            data: {
               status: $Enums.PaymentStatus.SUCCESS,
               paymentType: res.data.response.paymentType.name,
               updatedBy: "system",
               updatedAt: moment.tz().format(),
            },
         });
         const transaction = await prisma.transactions.findMany({
            where: {
               paymentId: update.id,
            },
            include: {
               user: true,
               payment: true,
            },
         });
         await prisma.transactions.updateMany({
            where: {
               paymentId: update.id,
            },
            data: {
               status: "PAID",
               updateAt: "system",
               updateBy: moment.tz().format(),
            },
         });
         if (transaction.length > 0) {
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
         }

         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${update.orderId} di update }\n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}]${value.orderId} di update\n`;
            fs.appendFileSync(filePath, message);
         }
      } else if (res.data.response.processStatus == "EXPIRED") {
         const update = await prisma.payments.update({
            where: {
               id: value.id,
            },
            data: {
               status: "DECLINE",
               noteFailed: "Payment Expired",
               updatedBy: "system",
               updatedAt: moment.tz().format(),
            },
         });
         await prisma.transactions.updateMany({
            where: {
               paymentId: update.id,
            },
            data: {
               status: "DECLINE",
               updateBy: "system",
               updateAt: moment.tz().format(),
            },
         });
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${update.orderId} di update }\n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}]${value.orderId} di update\n`;
            fs.appendFileSync(filePath, message);
         }
      } else {
         const message = `[${moment.tz().format()}]${value.orderId} gagal diupdate\n`;
         if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            fs.appendFileSync(filePath, message);
         }
      }
   });

   return NextResponse.json(
      {
         message: "success",
      },
      {
         status: HttpStatusCode.OK,
      },
   );
}
