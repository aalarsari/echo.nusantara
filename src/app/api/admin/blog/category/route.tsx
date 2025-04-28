import prisma from "@/database/prisma";
import { categoryBlogValidationUpdate } from "@/lib/zod-schema/blog";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function GET(request: NextRequest) {
  var page: any = request.nextUrl.searchParams.get("page")!;
  var pageSize: any = request.nextUrl.searchParams.get("pageSize");
  var pageSizeInt = parseInt(pageSize);

  const category = await prisma.categoryBlog.findMany({
    take: pageSizeInt,
    skip: (page - 1) * pageSize,
  });
  const countCategoty = await prisma.categoryBlog.count({});

  const data = {
    category: category,
    countCategoty: countCategoty,
  };
  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const validation = categoryBlogValidationUpdate.safeParse(body);
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
  const check = await prisma.categoryBlog.findFirst({
    where: {
      id: data?.id,
    },
  });
  const updatedCategory = await prisma.categoryBlog.update({
    where: {
      id: check?.id,
    },
    data: {
      isRecomended: !check?.isRecomended,
    },
  });

  return NextResponse.json({
    error: false,
    message: "Category updated successfully",
    data: updatedCategory,
  });
}
