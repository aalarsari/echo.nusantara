import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  var page: any = request.nextUrl.searchParams.get("page")!;
  var pageSize: any = request.nextUrl.searchParams.get("pageSize");
  var orderBy: any = request.nextUrl.searchParams.get("orderBy");
  var pageSizeInt = parseInt(pageSize);

  var blog = await prisma.blog.findMany({
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
    orderBy: {
      updateAt: orderBy ? orderBy : "desc",
    },
    take: pageSizeInt,
    skip: (page - 1) * pageSize,
  });

  var blogCount = await prisma.blog.count({});

  // get last blog
  var lastNews = await prisma.blog.findFirst({
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
    orderBy: {
      updateAt: "desc",
    },
  });

  var Blog = await prisma.userReadBlog.findMany({
    select: {
      blog: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
  });

  var topBlog = new Map<string, number>();

  Blog.map((e) => {
    const currentQuantity = topBlog.get(e.blog.slug) || 0;
    topBlog.set(e.blog.slug, currentQuantity + 1);
  });

  const sort = Array.from(topBlog.entries()).sort((a, b) => b[1] - a[1]);

  const BlogIds = sort.map((e) => {
    return e[0];
  });

  var top5: any[] = [];
  for (let i = 0; i < BlogIds.slice(0, 5).length; i++) {
    const e = BlogIds[i];

    var p = await prisma.blog.findFirst({
      where: {
        slug: e,
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
    });
    top5.push(p);
  }
  var data = {
    topBlog: top5,
    lastNews: lastNews,
    blog: blog,
    blogCount: blogCount,
  };
  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}
