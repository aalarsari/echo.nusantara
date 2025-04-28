import prisma from "@/database/prisma";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  var startDateString = request.nextUrl.searchParams.get("startDate");
  var endDateString = request.nextUrl.searchParams.get("endDate");

  var page: any = request.nextUrl.searchParams.get("page")!;
  var pageSize: any = request.nextUrl.searchParams.get("pageSize");
  var pageSizeInt = parseInt(pageSize);

  var startDate;
  var endDate;
  if (startDateString) {
    startDate = moment(startDateString!).startOf("days").toDate();
  }
  if (endDateString) {
    endDate = moment(endDateString!).endOf("days").toDate();
  }
  var payment = await prisma.payments.findMany({
    where: {
      transaction: {
        some: {
          status: {
            in: ["PAID", "NEW", "DECLINE"],
          },
        },
      },
      createdAt:
        startDate != null
          ? {
              gte: startDate,
              lte: endDate,
            }
          : undefined,
    },
    include: {
      user: true,
    },
    take: pageSizeInt,
    skip: (page - 1) * pageSize,
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        status: "asc",
      },
    ],
  });
  var count = await prisma.payments.count({
    where: {
      transaction: {
        some: {
          status: {
            in: ["PAID", "NEW", "DECLINE"],
          },
        },
      },
      createdAt:
        startDate != null
          ? {
              gte: startDate,
              lte: endDate,
            }
          : undefined,
    },
  });
  return NextResponse.json({
    error: false,
    message: null,
    data: {
      payment: payment,
      count: count,
    },
  });
}
