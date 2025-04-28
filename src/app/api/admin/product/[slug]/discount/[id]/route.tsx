import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } },
) {
  try {
    var product = await prisma.products.findFirst({
      where: { slug: params.slug },
      select: {
        id: true,
        slug: true,
      },
    });
    if (!product) {
      return NextResponse.json({
        error: true,
        message: "Product not found ",
        data: null,
      });
    }
    await prisma.discount.delete({
      where: {
        id: parseInt(params.id),
        productsId: product.id,
      },
    });

    return NextResponse.json({
      error: false,
      message: "Discount Product deleted successfully",
      data: null,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationError = fromZodError(err);
      return NextResponse.json(
        {
          error: true,
          message: null,
          data: validationError,
        },
        {
          status: HttpStatusCode.UnprocessableEntity,
        },
      );
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: true,
          message: null,
          data: err,
        },
        {
          status: HttpStatusCode.BadRequest,
        },
      );
    }
  }
}
