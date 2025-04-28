import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  var complaint = await prisma.complaint.findMany({
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      orderId: true,
      complaint: true,
      createAt: true,
      updateAt: true,
      status: true,
    },
  });
  return NextResponse.json({
    error: false,
    message: null,
    data: complaint,
  });
}
