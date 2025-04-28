import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { ComplainValidaton } from "@/lib/zod-schema/complaint";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import { fromZodError } from "zod-validation-error";
import { writeFile } from "fs/promises";
import { CreateLocationAttachment } from "@/lib/attachment";
import moment from "moment";

export async function POST(request: NextRequest) {
   var session = await getServerSession(authOptions);
   var body = await request.formData();
   try {
      var validation = ComplainValidaton.parse(body);

      const directoryPath = CreateLocationAttachment(3);

      var payment = await prisma.payments.findFirst({
         where: { orderId: validation.orderId },
      });
      if (validation.photo === "undefined") {
         validation.photo = null;
      }
      if (validation.photo) {
         var image = validation.photo as File;
         var imageBuffer = Buffer.from(await image.arrayBuffer());
         var imageName = image.name.replaceAll(" ", "-");
         var imageUrl = `${process.env.APP_URL}/static/attachment/complaint/images/${imageName}`;
         await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName}`), imageBuffer);
      }

      if (!payment) {
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
      var complaint = await prisma.complaint.create({
         data: {
            userId: parseInt(session?.user.userId!),
            orderId: validation.orderId,
            foto: imageUrl!,
            complaint: validation.complaint,
            createAt: moment.tz().format(),
            updateAt: moment.tz().format(),
            createBy: session?.user.name!,
            updateBy: session?.user.name!,
         },
      });
      return NextResponse.json({
         error: false,
         message: "complaint created",
         data: complaint,
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

export async function GET(request: NextRequest) {
   var session = await getServerSession(authOptions);
   var complaint = await prisma.complaint.findMany({
      where: {
         userId: parseInt(session?.user.userId!),
      },
   });
   return NextResponse.json(
      {
         error: false,
         message: null,
         data: complaint,
      },
      {
         status: HttpStatusCode.BadRequest,
      },
   );
}
