import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  var data = await prisma.complaint.findFirst({
    where: {
      id: parseInt(params.id),
    },
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
  if (!data) {
    return NextResponse.json({
      error: true,
      message: "Complaint not found ",
      data: null,
    });
  }
  await prisma.complaint.delete({
    where: {
      id: data.id,
    },
  });
  return NextResponse.json({
    error: false,
    message: " Complaint deleted successfully",
    data: null,
  });
}
