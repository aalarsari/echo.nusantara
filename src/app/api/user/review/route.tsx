import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { CreateProductReviewValidation } from "@/lib/zod-schema/review";
import { $Enums, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import moment from "moment-timezone";

export async function POST(request: NextRequest) {
   var body = await request.json();
   var session = await getServerSession(authOptions);
   var validation = CreateProductReviewValidation.safeParse(body);

   if (validation.error) {
      const validationError = fromZodError(validation.error);
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
   }
   const data = validation.data;

   var checkProduct = prisma.products.findFirst({
      where: {
         id: data.productId,
      },
   });

   if (!checkProduct) {
      return NextResponse.json(
         {
            error: true,
            message: "data not found",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }
   var review = await prisma.reviewProduct.create({
      data: {
         productsId: data.productId,
         rate: data.rate,
         review: data.review,
         userId: parseInt(session?.user.userId!),
         createdAt: moment.tz().format(),
         createdBy: session?.user.name!,
         updatedAt: moment.tz().format(),
         updatedBy: session?.user.name!,
      },
      select: {
         rate: true,
         review: true,
         user: {
            select: {
               name: true,
               email: true,
            },
         },
         product: {
            select: {
               id: true,
               name: true,
            },
         },
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: review,
   });
}

export async function GET(request: NextRequest) {
   var session = await getServerSession(authOptions);
   var orderDirection = request.nextUrl.searchParams.get("orderDirection")?.trim() as Prisma.SortOrder;
   var orderDirectionValid: string[] = ["asc", "desc"];
   if (orderDirection?.length! <= 0 && orderDirectionValid.includes(orderDirection!)) {
      return NextResponse.json(
         {
            error: true,
            message: "Invalid Order Direction ",
            data: null,
         },
         { status: 400 },
      );
   }
   var review = await prisma.reviewProduct.findMany({
      where: { userId: parseInt(session?.user.userId!) },
      select: {
         id: true,
         review: true,
         rate: true,
         product: {
            select: {
               name: true,
               priceIDR: true,
               image1: true,
            },
         },
         user: {
            select: {
               name: true,
            },
         },
         createdAt: true,
      },
      orderBy: {
         createdAt: orderDirection.length > 0 ? orderDirection! : "asc",
      },
   });
   var count = await prisma.reviewProduct.count({
      where: {
         userId: parseInt(session?.user.userId!),
      },
   });

   var data = {
      review: review,
      count: count,
   };
   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
