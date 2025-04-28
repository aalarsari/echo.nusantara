import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import moment from "moment-timezone";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
   var blog = await prisma.blog.findFirst({
      where: {
         slug: params.slug,
      },
      select: {
         id: true,
         slug: true,
         title: true,
         subtitle: true,
         image: true,
         content: true,
         updateAt: true,
         updateBy: true,
      },
   });
   // check uuid udah ada ngak di cookies
   var user = request.cookies.get("user")?.value ?? null;
   var check: any;
   if (user) {
      check = await prisma.userReadBlog.findFirst({
         where: {
            blogId: blog?.id,
            user: user!,
         },
      });
   }

   if (!check) {
      var uuid = crypto.randomUUID();
      cookies().set("user", uuid);
      await prisma.userReadBlog.create({
         data: {
            blogId: blog?.id!,
            user: uuid,
            createdAt: moment.tz("Asia/Jakarta").format(),
            createdBy: uuid,
         },
      });
   }

   return NextResponse.json({
      error: false,
      message: null,
      data: blog,
   });
}
