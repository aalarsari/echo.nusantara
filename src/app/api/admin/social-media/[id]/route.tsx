import prisma from "@/database/prisma";
import { CreateLocationAttachment } from "@/lib/attachment";
import { SocialMediaUpdateValidation } from "@/lib/zod-schema/socialMedia";
import { HttpStatusCode } from "axios";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { fromZodError } from "zod-validation-error";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
   var body = await request.formData();

   var validation = SocialMediaUpdateValidation.safeParse(body);
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
   var imageUrl: string;
   const directoryPath = CreateLocationAttachment(5);
   if (data.image != undefined || data.image != null || data.image != "null" || data.image != "undefined") {
      var image = data.image as File;
      var imageBuffer1 = Buffer.from(await image.arrayBuffer());
      var imageName1 = image.name.replaceAll(" ", "-");
      imageUrl = `${process.env.APP_URL}/static/attachment/social-media/images/${imageName1}`;
      await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName1}`), imageBuffer1 as unknown as Uint8Array);
   }

   var checkData = await prisma.socialMedia.findFirst({
      where: {
         id: parseInt(params.id),
      },
   });
   if (!checkData) {
      return NextResponse.json({
         error: true,
         message: null,
         data: null,
      });
   }
   var update = await prisma.socialMedia.update({
      where: {
         id: checkData.id,
      },
      data: {
         name: data.name != null ? data.name! : checkData?.name!,
         link: data.link != null ? data.link! : checkData?.link!,
         image: imageUrl! != null ? imageUrl! : checkData?.image!,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: update,
   });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   var body = await request.formData();

   var checkData = await prisma.socialMedia.findFirst({
      where: {
         id: parseInt(params.id),
      },
   });
   if (!checkData) {
      return NextResponse.json({
         error: true,
         message: null,
         data: null,
      });
   }
   var update = await prisma.socialMedia.update({
      where: {
         id: checkData.id,
      },
      data: {
         isActive: !checkData.isActive,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: update,
   });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
   //   var body = await request.json();
   var checkData = await prisma.socialMedia.findFirst({
      where: {
         id: parseInt(params.id),
      },
   });
   if (!checkData) {
      return NextResponse.json({
         error: true,
         message: null,
         data: null,
      });
   }

   return NextResponse.json({
      error: false,
      message: null,
      data: checkData,
   });
}
