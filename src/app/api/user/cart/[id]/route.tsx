import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { updateCartValidation } from "@/lib/zod-schema/cart";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  var body = await request.json();
  var getData = await prisma.cart.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!getData) {
    return NextResponse.json(
      {
        error: true,
        message: "cart data in not found",
        data: null,
      },
      {
        status: HttpStatusCode.BadRequest,
      },
    );
  }
  try {
    var validation = updateCartValidation.parse(body);
    var cart = await prisma.cart.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        buyQuantity: validation.quantity,
      },
    });
    return NextResponse.json({
      error: false,
      message: "cart updated successfully",
      data: cart,
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  var session = await getServerSession(authOptions);

  var getData = await prisma.cart.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!getData) {
    return NextResponse.json(
      {
        error: true,
        message: "cart data in not found",
        data: null,
      },
      {
        status: HttpStatusCode.BadRequest,
      },
    );
  }

  await prisma.cart.delete({
    where: {
      id: parseInt(params.id),
    },
  });

  var cart = await prisma.cart.findMany({
    where: {
      userId: parseInt(session?.user.userId!),
    },
    select: {
      id: true,
      buyQuantity: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          priceIDR: true,
        },
      },
    },
  });
  return NextResponse.json({
    error: false,
    message: "cart deleted successfully",
    data: cart,
  });
}
