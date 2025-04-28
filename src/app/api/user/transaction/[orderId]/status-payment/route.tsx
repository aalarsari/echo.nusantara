import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
   var session = await getServerSession(authOptions);

   var checkTranscation = await prisma.payments.findFirst({
      where: {
         userId: parseInt(session?.user.userId!),
         orderId: params.orderId,
      },
      select: {
         id: true,
         status: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: checkTranscation,
   });
}
