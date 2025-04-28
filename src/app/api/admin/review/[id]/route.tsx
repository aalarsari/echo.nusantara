import prisma from "@/database/prisma";
import { CreateLocationAttachment } from "@/lib/attachment";
import moment from "moment-timezone";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { UpdateReviewValidation } from "@/lib/zod-schema/review";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { fromZodError } from "zod-validation-error";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
   var reviewId = parseInt(params.id);
   var data = await prisma.review.findFirst({
      where: { id: reviewId },
      select: {
         title: true,
         subTitle: true,
         image: true,
         id: true,
         review: true,
         rate: true,
         createdAt: true,
         name: true,
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
   const directoryPath = CreateLocationAttachment(7);
   var body = await request.json();
   var validation = UpdateReviewValidation.safeParse(body);
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
   if (data.photo != "null") {
      var photo = data.photo as File;
      var imageBuffer1 = Buffer.from(await photo.arrayBuffer());
      var imageName1 = photo.name.replaceAll(" ", "-");
      await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName1}`), imageBuffer1 as unknown as Uint8Array);
   }
   var checkData = await prisma.review.findFirst({
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
   var review = await prisma.review.update({
      where: {
         id: checkData.id,
      },
      data: {
         name: data.name != "null" || data.name != null ? data.name! : checkData.name,

         title: data.title != "null" || data.title != null ? data.title! : checkData.title,
         subTitle: data.subtitle != "null" || data.subtitle != null ? data.subtitle! : checkData.subTitle,
         image: photo! != null ? `${process.env.APP_URL}/images/${photo}` : checkData?.image!,
         rate: data.rate,
         review: data.review != "null" || data.review != null ? data.review! : checkData.review,
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
