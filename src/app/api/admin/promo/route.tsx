import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import prisma from "@/database/prisma";
import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { CreateLocationAttachment } from "@/lib/attachment";
import moment from "moment-timezone";
import { PromoValidation } from "@/lib/zod-schema/promo";

export async function POST(request: NextRequest) {
   var body = await request.formData();
   try {
      const directoryPath = CreateLocationAttachment(2);
      var validation = PromoValidation.parse(body);

      var image1 = validation.photo as File;
      var imageBuffer1 = Buffer.from(await image1.arrayBuffer());
      var imageName1 = image1.name.replaceAll(" ", "-");
      await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName1}`), imageBuffer1 as unknown as Uint8Array);
      var banner = await prisma.promo.create({
         data: {
            title: validation.title,
            subtitle: validation.subtitle,
            photo: `${process.env.APP_URL}/static/attachment/banner/images/${imageName1}`,
            createdAt: moment.tz().format(),
         },
      });
      return NextResponse.json({
         error: false,
         message: "Promo created successfully",
         data: banner,
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
   var banner = await prisma.banner.findMany({
      select: {
         title: true,
         subtitle: true,
         path: true,
      },
   });

   return NextResponse.json({
      error: false,
      message: null,
      data: banner,
   });
}
