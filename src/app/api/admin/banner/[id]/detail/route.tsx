import prisma from "@/database/prisma";
import { CreateLocationAttachment } from "@/lib/attachment";
import { UpdateBannerValidation } from "@/lib/zod-schema/banner";
import { HttpStatusCode } from "axios";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { fromZodError } from "zod-validation-error";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   const body = await request.json();
   const validation = UpdateBannerValidation.safeParse(body);
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
   const directoryPath = CreateLocationAttachment(2);

   var image = data?.path;

   var foto = Buffer.from(image, "base64");
   var imageName = `${randomUUID().replace("-", "")}.jpg`;
   await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName}`), foto);

   var getData = await prisma.banner.findFirst({
      where: {
         id: parseInt(params.id),
      },
   });
   var banner = await prisma.banner.update({
      where: {
         id: getData?.id!,
      },
      data: {
         title: data?.title!,
         subtitle: data?.subtitle!,
         category: data?.category,
         path: `${process.env.APP_URL}/static/attachment/banner/images/${imageName}`,
         createdAt: moment.tz().format(),
      },
   });
   return NextResponse.json({
      error: false,
      message: "Banner updated successfully",
      data: banner,
   });
}
