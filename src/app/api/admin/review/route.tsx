import prisma from "@/database/prisma";
import { CreateLocationAttachment } from "@/lib/attachment";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { CreateReviewValidation } from "@/lib/zod-schema/review";
import { Prisma } from "@prisma/client";
import moment from "moment-timezone";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest) {
   var body = await request.formData();
   var session = await getServerSession(authOptions);
   var validation = CreateReviewValidation.safeParse(body);

   const directoryPath = CreateLocationAttachment(7);

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
   var image1 = data.photo as File;
   var imageBuffer1 = Buffer.from(await image1.arrayBuffer());
   var imageName1 = image1.name.replaceAll(" ", "-");
   await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName1}`), imageBuffer1 as unknown as Uint8Array);
   var review = await prisma.review.create({
      data: {
         name: data.name,
         title: data.title,
         subTitle: data.subtitle!,
         image: `${process.env.APP_URL}/static/attachment/review/images/${imageName1}`,
         rate: data.rating,
         review: data.review,
         createdAt: moment.tz().format(),
         createdBy: session?.user.name!,
         updatedAt: moment.tz().format(),
         updatedBy: session?.user.name!,
      },
      select: {
         rate: true,
         review: true,
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
   var orderDirection: string | null | undefined = request.nextUrl.searchParams.get("orderDirection")?.trim();

   var orderDirectionValid: string[] = ["asc", "desc"];
   if (orderDirection != undefined) {
      if (!orderDirectionValid.includes(orderDirection!)) {
         return NextResponse.json(
            {
               error: true,
               message: "Invalid Order Direction ",
               data: null,
            },
            { status: 400 },
         );
      }
   }
   var review = await prisma.review.findMany({
      select: {
         name: true,
         title: true,
         subTitle: true,
         image: true,
         id: true,
         review: true,
         rate: true,
         createdAt: true,
      },
      orderBy: {
         createdAt: orderDirection != undefined || orderDirection != null ? (orderDirection! as Prisma.SortOrder) : "desc",
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
