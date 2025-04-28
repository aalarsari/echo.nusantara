import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { category: string } }) {
   var page: any = request.nextUrl.searchParams.get("page")!;
   var pageSize: any = request.nextUrl.searchParams.get("pageSize");
   var pageSizeInt = parseInt(pageSize);
   const blog = await prisma.blog.findMany({
      where: {
         category: {
            name: params.category,
         },
      },
      select: {
         slug: true,
         title: true,
         subtitle: true,
         image: true,
         category: {
            select: {
               name: true,
            },
         },
         updateAt: true,
         updateBy: true,
      },
      take: pageSizeInt,
      skip: (page - 1) * pageSize,
   });
   var blogCount = await prisma.blog.count({
      where: {
         category: {
            name: params.category,
         },
      },
   });
   const data = {
      blog: blog,
      blogCount: blogCount,
   };

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
