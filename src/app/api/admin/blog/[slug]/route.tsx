import prisma from "@/database/prisma";
import { CreateLocationAttachment } from "@/lib/attachment";
import { authOptions } from "@/lib/nextAuth/auth";
import { UpdateBlogValidation } from "@/lib/zod-schema/blog";
import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import slugify from "react-slugify";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import moment from "moment-timezone";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
   var blog = await prisma.blog.findFirst({
      where: {
         slug: params.slug,
      },
      select: {
         slug: true,
         title: true,
         subtitle: true,
         image: true,
         content: true,
         updateAt: true,
         updateBy: true,
         category: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: blog,
   });
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
   var body = await request.json();
   var session = await getServerSession(authOptions);

   try {
      var validation = UpdateBlogValidation.safeParse(body);
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
      var checkContent = await prisma.blog.findFirst({
         where: {
            slug: params.slug,
         },
         include: { category: true },
      });
      if (!checkContent) {
         return NextResponse.json(
            {
               error: true,
               message: "content not found",
               data: checkContent,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
      var fileUrl: string[] = [];
      if (data.image && data.image.length > 0) {
         const directoryPath = CreateLocationAttachment(6);

         for (let i = 0; i < data.image.length; i++) {
            var image = data.image[i];
            var foto = Buffer.from(image, "base64");
            var imageName = `${randomUUID().replace("-", "")}.jpg`;
            await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName}`), foto as unknown as Uint8Array);
            var imageUrl = `${process.env.APP_URL}/static/attachment/blog/images/${imageName}`;
            fileUrl.push(imageUrl);
         }
      }
      var slug;
      if (data.title) {
         slug = slugify(data.title);
      }

      var blog = await prisma.blog.update({
         where: {
            slug: params.slug,
         },
         data: {
            slug: slug != null ? slug! : checkContent.slug,
            title: data.title != "" || data.title != null ? data.title! : checkContent.title,
            subtitle: data.subtitle != "" || data.subtitle != null ? data.subtitle! : checkContent.subtitle,
            content: data.content != "" || data.content != null ? data.content! : checkContent.content,
            image: fileUrl! != null ? fileUrl! : checkContent.image,
            createdAt: moment.tz().format(),
            createdBy: session?.user.name!,
            updateAt: moment.tz().format(),
            updateBy: session?.user.name!,
            category: {
               update: {
                  name: data.category != "" || data.category != null ? data.category! : checkContent.category?.name,
               },
            },
         },
      });

      return NextResponse.json({
         error: false,
         message: null,
         data: blog,
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
// find 

const blog = await prisma.blog.findFirst({
   where: {
      slug: params.slug,
   },
});
if (!blog) {
   return NextResponse.json({
      error: true,
      message: "Blog not found",
      data: null,
   },{status: HttpStatusCode.BadRequest});
}
   var deleteBlog = await prisma.blog.delete({
      where: {
         slug: params.slug,
      },
   });
   return NextResponse.json({
      error: false,
      message: "Blog deleted successfully",
      data: deleteBlog,
   });
}
