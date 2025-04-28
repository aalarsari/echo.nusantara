import prisma from "@/database/prisma";
import { CreateBlogValidation } from "@/lib/zod-schema/blog";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import slugify from "react-slugify";
import { writeFile } from "fs/promises";
import { CreateLocationAttachment } from "@/lib/attachment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth/auth";
import { randomUUID } from "crypto";
import moment from "moment-timezone";
import { fromZodError } from "zod-validation-error";
import { HttpStatusCode } from "axios";

export async function GET(request: NextRequest) {
   var page: any = request.nextUrl.searchParams.get("page")!;
   var pageSize: any = request.nextUrl.searchParams.get("pageSize");
   var pageSizeInt = parseInt(pageSize);
   var searchP: string = request.nextUrl.searchParams.get("search")!;

   var search: any = {
      title: {
         mode: "insensitive",
         contains: searchP,
      },
   };
   if (searchP.length == 0 || searchP == "undifined" || searchP == null || searchP == undefined) {
      search = {};
   }

   var blog = await prisma.blog.findMany({
      where: {
         ...search,
      },

      select: {
         slug: true,
         title: true,
         subtitle: true,
         image: true,
         updateAt: true,
         updateBy: true,
      },
      take: pageSizeInt,
      skip: (page - 1) * pageSize,
      orderBy: {
         updateAt: "desc",
      },
   });
   var blogCount = await prisma.blog.count({
      where: {
         ...search,
      },
   });

   var data = {
      blog: blog,
      count: blogCount,
   };

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}

export async function POST(request: NextRequest) {
   var session = await getServerSession(authOptions);
   var body = await request.json();
   var validation = CreateBlogValidation.safeParse(body);

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
   var fileUrl: string[] = [];
   const directoryPath = CreateLocationAttachment(6);

   var slug = slugify(data?.title);

   // find slug already exist
   const check = await prisma.blog.findFirst({ where: { slug: slug } });
   if (check) {
      return NextResponse.json(
         {
            error: true,
            message: "Duplicate title",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }
   for (let i = 0; i < data!.image.length; i++) {
      var image = data?.image[i];
      var foto = Buffer.from(image!, "base64");
      var imageName = `${randomUUID().replace("-", "")}.jpg`;
      await writeFile(path.join(process.cwd(), `${directoryPath}/${imageName}`), foto as unknown as Uint8Array);
      var imageUrl = `${process.env.APP_URL}/static/attachment/blog/images/${imageName}`;
      fileUrl.push(imageUrl);
   }
   // find category
   var category = await prisma.categoryBlog.findFirst({
      where: {
         name: {
            contains: data?.category.toLocaleLowerCase(),
         },
      },
   });
   if (!category) {
      category = await prisma.categoryBlog.create({
         data: {
            name: data!.category.toLowerCase(),
         },
      });
   }
   var blog = await prisma.blog.create({
      data: {
         slug: slug,
         title: data!.title,
         subtitle: data!.subtitle,
         content: data!.content,
         image: fileUrl,
         createdAt: moment.tz().format(),
         createdBy: session?.user.name!,
         updateAt: moment.tz().format(),
         updateBy: session?.user.name!,
         categoryId: category.id,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: blog,
   });
}
