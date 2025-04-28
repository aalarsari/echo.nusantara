import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { ProductUpadateValidation } from "@/lib/zod-schema/product";
import { Prisma } from "@prisma/client";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import moment from "moment-timezone";
import { CreateLocationAttachment } from "@/lib/attachment";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
   var product = await prisma.products.findFirst({
      where: { slug: params.slug },
      select: {
         slug: true,
         name: true,
         descriptions: true,
         priceIDR: true,
         weight: true,
         stock: true,
         maxOrder: true,
         categoryId: true,
         recommendation: true,
         image1: true,
         image2: true,
         image3: true,
         image4: true,
         image5: true,
         size: true,
         Discount: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: product,
   });
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
   const session = await getServerSession(authOptions);

   var body = await request.formData();
   try {
      var validation = ProductUpadateValidation.parse(body);
      const directoryPath = CreateLocationAttachment(1);

      if (validation.image1 != "null") {
         var image1 = validation.image1 as File;
         var imageBuffer1 = Buffer.from(await image1.arrayBuffer());
         var imageName1 = image1.name.replaceAll(" ", "-");
         await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName1}`), imageBuffer1 as unknown as Uint8Array);
      }
      if (validation.image2 != "null") {
         var image2 = validation.image2 as File;
         var imageBuffer2 = Buffer.from(await image2.arrayBuffer());
         var imageName2 = image2.name.replaceAll(" ", "-");
         await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName2}`), imageBuffer2 as unknown as Uint8Array);
      }

      if (validation.image3 != "null") {
         var image3 = validation.image3 as File;
         var imageBuffer3 = Buffer.from(await image3.arrayBuffer());
         var imageName3 = image3.name.replaceAll(" ", "-");
         await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName3}`), imageBuffer3 as unknown as Uint8Array);
      }

      if (validation.image4 != "null") {
         var image4 = validation.image4 as File;
         var imageBuffer4 = Buffer.from(await image4.arrayBuffer());
         var imageName4 = image4.name.replaceAll(" ", "-");
         await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName4}`), imageBuffer4 as unknown as Uint8Array);
      }

      if (validation.image5 != "null") {
         var image5 = validation.image5 as File;
         var imageBuffer5 = Buffer.from(await image5.arrayBuffer());
         var imageName5 = image5.name.replaceAll(" ", "-");
         await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName5}`), imageBuffer5 as unknown as Uint8Array);
      }
      var product = await prisma.products.findFirst({
         where: {
            slug: params.slug,
         },
      });

      var updateProduct = await prisma.products.update({
         where: {
            slug: params.slug,
         },
         data: {
            name: validation.name != "null" || validation.name != null ? validation.name! : product?.name!,
            descriptions: validation.descriptions != "null" || validation.descriptions != null ? validation.descriptions! : product?.descriptions!,
            subDescriptions: validation.subDescriptions != "null" || validation.subDescriptions != null ? validation.subDescriptions : validation.subDescriptions!,
            priceIDR: validation.priceIDR != null ? validation.priceIDR! : product?.priceIDR!,
            weight: validation.weight != null ? validation.weight! : product?.weight!,
            maxOrder: validation.maxOrder != null ? validation.maxOrder! : product?.maxOrder!,
            stock: validation.stock != null ? validation.stock! : product?.stock!,
            categoryId: validation.categoryId != null ? validation.categoryId! : product?.categoryId!,
            image1: imageName1! != null ? `${process.env.APP_URL}/images/${imageName1}` : product?.image1,
            image2: imageName2! != null ? `${process.env.APP_URL}/images/${imageName2}` : product?.image2,
            image3: imageName3! != null ? `${process.env.APP_URL}/images/${imageName3}` : product?.image3,
            image4: imageName4! != null ? `${process.env.APP_URL}/images/${imageName4}` : product?.image4,
            image5: imageName5! != null ? `${process.env.APP_URL}/images/${imageName5}` : product?.image5,
            size: validation.size != null ? validation.size! : product?.size!,
            updateAt: moment.tz().format(),
            updateBy: session?.user.name,
         },
      });
      return NextResponse.json({
         error: false,
         message: "Product updated successfully",
         data: updateProduct,
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

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
   const session = await getServerSession(authOptions);
   try {
      var product = await prisma.products.findFirst({
         where: {
            slug: params.slug,
         },
      });
      var deleteProduct = await prisma.products.update({
         where: {
            id: product?.id!,
         },
         data: {
            deleteAt: moment.tz().format(),
            deleteBy: session?.user.name!,
         },
      });
      return NextResponse.json({
         error: false,
         message: "Product updated successfully",
         data: deleteProduct,
      });
   } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
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
