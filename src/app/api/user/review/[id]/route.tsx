import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { UpdateReviewProductValidation } from "@/lib/zod-schema/review";
import { Prisma } from "@prisma/client";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
   var reviewId = parseInt(params.id);
   var data = await prisma.reviewProduct.findFirst({
      where: { id: reviewId },
      select: {
         rate: true,
         review: true,
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
   if (!data) {
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
   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   var session = await getServerSession(authOptions);

   var reviewId = parseInt(params.id);
   var body = await request.json();
   var validation = UpdateReviewProductValidation.safeParse(body);
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
   var checkData = await prisma.reviewProduct.findFirst({
      where: {
         id: reviewId,
      },
   });

   if (!checkData) {
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
   var review = await prisma.reviewProduct.update({
      where: {
         id: checkData.id,
      },
      data: {
         rate: data.rate,
         review: data.review!,
         updatedAt: moment.tz().format(),
         updatedBy: session?.user.name!,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: review,
   });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
   var session = await getServerSession(authOptions);

   var reviewId = parseInt(params.id);

   var checkData = await prisma.reviewProduct.findFirst({
      where: {
         id: reviewId,
      },
   });
   if (!checkData) {
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
   await prisma.reviewProduct.delete({
      where: {
         id: reviewId,
         userId: parseInt(session?.user.userId!),
      },
   });
   return NextResponse.json({
      error: false,
      message: " review deleted successfully",
      data: null,
   });
}
