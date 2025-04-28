import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import axios, { Axios } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import moment from "moment-timezone";

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

   var data = await prisma.shipment.findMany({
      where: {
         status: {
            notIn: ["delivered", "rejected", "returned", "disposed"],
         },
         payment: {
            status: "SUCCESS",
            transaction: {
               some: {
                  status: "PROCESS",
               },
            },
         },
      },
      select: {
         id: true,
         shipmentCode: true,
      },
   });
   const flagNew = { flag: "wx" };
   data.forEach(async (value, index) => {
      var res = await axios.request({
         url: `${process.env.BITSHIP_URL}v1/orders/${value.shipmentCode}`,
         headers: header,
         method: "GET",
      });
      if (res.status == HttpStatusCode.OK) {
         const responseData: OrderResponse = res.data;
         const update = await prisma.shipment.update({
            where: {
               id: value.id,
            },
            data: {
               price: responseData.price,
               status: responseData.status,
               updatedBy: "system",
               updatedAt: moment.tz().format(),
            },
            include: {
               payment: true,
            },
         });
         if (responseData.status == "delivered") {
            await prisma.transactions.updateMany({
               where: {
                  paymentId: update?.payment?.id!,
               },
               data: {
                  status: "DONE",
                  updateBy: "system",
                  updateAt: moment.tz().format(),
               },
            });
         } else if (responseData.status == "rejected" || responseData.status == "returned" || responseData.status == "disposed" || responseData.status == "cancelled") {
            await prisma.transactions.updateMany({
               where: {
                  paymentId: update?.payment?.id!,
               },
               data: {
                  status: "DECLINE",
                  updateBy: "system",
                  updateAt: moment.tz().format(),
               },
            });
         }
         const message = `[${moment.tz().format()}] shipment code ${value.shipmentCode} diupdate\n`;
         if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            fs.appendFileSync(filePath, message);
         }
      } else {
         const message = `[${moment.tz().format()}]shipment code ${value.shipmentCode} gagal diupdate\n`;
         if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            fs.appendFileSync(filePath, message);
         }
      }
   });

   return NextResponse.json({ message: "success" }, { status: HttpStatusCode.OK });
}
