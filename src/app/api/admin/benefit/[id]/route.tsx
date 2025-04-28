import prisma from "@/database/prisma";
import { CreateLocationAttachment } from "@/lib/attachment";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { BenefitProductUpdate } from "@/lib/zod-schema/benefit";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { writeFile } from "fs/promises";
import path from "path";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
   try {
      var product = await prisma.productsBenefit.findFirst({
         where: { id: parseInt(params.id) },
         select: {
            id: true,
         },
      });
      if (!product) {
         return NextResponse.json(
            {
               error: true,
               message: "Benefit not found ",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
      await prisma.productsBenefit.delete({
         where: {
            id: parseInt(params.id),
         },
      });

      return NextResponse.json({
         error: false,
         message: "Benefit Product deleted successfully",
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
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
   var data = await prisma.productsBenefit.findFirst({
      where: {
         id: parseInt(params.id),
      },
   });
   if (!data) {
      return NextResponse.json({
         error: true,
         message: "Benefit not found ",
      });
   }
   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   var body = request.json();
   var validation = BenefitProductUpdate.safeParse(body);
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
   var findData = await prisma.productsBenefit.findFirst({
      where: {
         id: parseInt(params.id),
      },
   });
   if (!findData) {
      return NextResponse.json({
         error: true,
         message: "Benefit not found ",
      });
   }
   const data = validation.data;
   if (data.photo === "undefined") {
      data.photo = null;
   }

   const directoryPath = CreateLocationAttachment(4);

   if (data.photo) {
      var photo = data.photo as File;
      var photoBuffer = Buffer.from(await photo.arrayBuffer());
      var photoName = photo.name.replaceAll(" ", "-");
      await writeFile(path.join(process.cwd(), `${directoryPath}/${photoName}`), photoBuffer);
      var imageUrl = `${process.env.APP_URL}/static/attachment/bennefit/images/${photoName}`;
   }
   var payload = await prisma.productsBenefit.update({
      where: {
         id: findData.id,
      },
      data: {
         descripton: data.description != "" || data.description != null ? data.description! : findData.descripton,
         title: data.title != "" || data.title != null ? data.title! : findData.title,
         image: imageUrl! != null ? imageUrl! : findData.image,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: payload,
   });
}
