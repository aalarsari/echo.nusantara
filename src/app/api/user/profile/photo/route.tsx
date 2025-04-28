import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { photoProfileUpdate } from "@/lib/zod-schema/profile";
import prisma from "@/database/prisma";
import { CreateLocationAttachment } from "@/lib/attachment";
import { fromZodError } from "zod-validation-error";
import { HttpStatusCode } from "axios";

export async function PUT(request: NextRequest) {
   const session = await getServerSession(authOptions);
   var body = await request.formData();
   const directoryPath = CreateLocationAttachment(0);
   var validation = photoProfileUpdate.safeParse(body);
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
   var imageUrl = `${process.env.APP_URL}/static/attachment/user/images/${imageName1}`;

   await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName1}`), imageBuffer1 as unknown as Uint8Array);

   var user = await prisma.user.update({
      where: { id: parseInt(session?.user.userId!) },
      data: {
         photo: imageUrl,
      },
   });
   return NextResponse.json({
      error: false,
      message: "profile update",
      data: user,
   });
}
