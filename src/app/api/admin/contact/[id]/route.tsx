import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  var data = await prisma.questionsUser.findMany({
    where: {
      id: parseInt(params.id),
    },
  });
  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}
