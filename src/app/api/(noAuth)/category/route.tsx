import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  var category = await prisma.category.findMany();
  return NextResponse.json({
    error: false,
    message: null,
    data: category,
  });
}
