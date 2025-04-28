import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import Invoice from "@/lib/pdf/template/invoice";
import ReactPDF from "@react-pdf/renderer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
   const session = await getServerSession(authOptions);
   var payment = await prisma.payments.findFirst({
      where: {
         userId: parseInt(session?.user.userId!),
         orderId: params.orderId,
      },
      select: {
         transaction: {
            select: {
               products: {
                  select: {
                     name: true,
                  },
               },
               quantity: true,
               createdAt: true,
               status: true,
            },
         },
         user: {
            select: {
               name: true,
            },
         },
         id: true,
         amount: true,
         orderId: true,
         createdAt: true,
         status: true,
         updatedAt: true,
      },
   });

   var stream = await ReactPDF.renderToStream(
      Invoice({
         orderId: payment?.orderId!,
         id: payment?.id!,
         amount: payment?.amount!,
         status: payment?.status!,
         createdAt: payment?.createdAt!,
         updatedAt: payment?.updatedAt!,
         user: payment?.user!,
         transaction: payment?.transaction!,
      }),
   );

   const chunks = [];
   for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
   }
   const buffer = Buffer.concat(chunks);

   return new NextResponse(buffer, {
      headers: {
         "Content-Type": "application/pdf",
      },
   });

   //   return NextResponse.json({
   //     error: false,
   //     message: null,
   //     data: payment,
   //   });
}
