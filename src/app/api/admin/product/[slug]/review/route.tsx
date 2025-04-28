import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  var product = await prisma.reviewProduct.findMany({
    where: {
      product: {
        slug: params.slug,
      },
    },
  });
  return NextResponse.json({
    error: false,
    message: null,
    data: product,
  });
}
