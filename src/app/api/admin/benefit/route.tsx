import prisma from "@/database/prisma";
import { BenefitProduct } from "@/lib/zod-schema/benefit";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { CreateLocationAttachment } from "@/lib/attachment";
import { ZodError } from "zod";
import { HttpStatusCode } from "axios";

export async function GET(request: NextRequest) {
   var data = await prisma.productsBenefit.findMany({
      select: {
         title: true,
         descripton: true,
         image: true,
      },
   });
   if (!data) {
      return NextResponse.json({
         error: true,
         message: "Product not found ",
         data: null,
      });
   }
   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}

export async function POST(request: NextRequest) {
   var body = request.json();
   var validation = BenefitProduct.safeParse(body);
   
   const data = validation.data;

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

   if (data!.photo === "undefined") {
      data!.photo = null;
   }

   const directoryPath = CreateLocationAttachment(4);

   if (data!.photo) {
      var photo = data!.photo as File;
      var photoBuffer = Buffer.from(await photo.arrayBuffer());
      var photoName = photo.name.replaceAll(" ", "-");
      var imageUrl = `${process.env.APP_URL}/static/attachment/bennefit/images/${photoName}`;

      await writeFile(path.join(process.cwd(), `${directoryPath}/${photoName}`), photoBuffer as unknown as Uint8Array);
   }

   var createData = await prisma.productsBenefit.create({
      data: {
         title: data!.title,
         descripton: data!.description,
         image: imageUrl!,
      },
   });

   return NextResponse.json({
      error: false,
      message: null,
      data: createData,
   });
}
function fromZodError(
   error: ZodError<FormData | { entries(): IterableIterator<[string, FormDataEntryValue]>; [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]> }>,
) {
   throw new Error("Function not implemented.");
}
