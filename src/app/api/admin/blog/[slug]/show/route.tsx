import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import moment from "moment-timezone";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  const checkProduct = await prisma.blog.findFirst({
    where: {
      slug: params.slug,
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
  const updateProduct = await prisma.blog.update({
    where: {
      id: checkProduct.id,
    },
    data: {
      isShow: !checkProduct.isShow,
      updateAt: moment.tz().format(),
      updateBy: session?.user.name!,
    },
  });

  return NextResponse.json({
    error: false,
    message: "Product updated successfully",
    data: updateProduct,
  });
}
