import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  var search = request.nextUrl.searchParams.get("data");
  var data = await prisma.products.findMany({
    orderBy: {
      name: "desc",
    },
    where: {
      deleteAt: null,
      deleteBy: null,
      OR: [
        {
          name: {
            contains: search!.trim(),
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search!.trim(),
              mode: "insensitive",
            },
          },
        },
      ],
    },
    select: {
      name: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}
