import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import moment from "moment-timezone";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const checkProduct = await prisma.banner.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!checkProduct) {
    return NextResponse.json(
      {
        error: true,
        message: "Product not found",
        data: null,
      },
      {
        status: 404,
      }
    );
  }
  const updateProduct = await prisma.banner.update({
    where: {
      id: checkProduct.id,
    },
    data: {
      isShow: !checkProduct.isShow,
    },
  });

  return NextResponse.json({
    error: false,
    message: "Product updated successfully",
    data: updateProduct,
  });
}
