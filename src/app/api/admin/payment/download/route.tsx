import prisma from "@/database/prisma";
import { $Enums } from "@prisma/client";
import { HttpStatusCode } from "axios";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import { utils, write, set_fs } from "xlsx";

interface Data {
  No: number;
  Tanggal: string;
  Nama: string;
  OrderId: string;
  Status: string;
  TotalHarga: number;
}

export async function GET(request: NextRequest) {
  set_fs(fs);

  var filterBy = request.nextUrl.searchParams.get("filterBy")?.trim();
  var filterWith = request.nextUrl.searchParams.get("filterWith")?.trim();

  var startDateString = request.nextUrl.searchParams.get("startDate");
  var endDateString = request.nextUrl.searchParams.get("endDate");

  var startDate = moment
    .tz("Asia/Jakarta")
    .subtract(1, "month")
    .startOf("days");
  var endDate = moment.tz("Asia/Jakarta").endOf("days");
  if (startDateString) {
    startDate = moment(startDateString!).startOf("days");
  }
  if (endDateString) {
    endDate = moment(endDateString!).endOf("days");
  }

  var transactionStatus: string[] = [
    $Enums.PaymentStatus.PENDING,
    $Enums.PaymentStatus.DECLINE,
    $Enums.PaymentStatus.SUCCESS,
    "ALL",
  ];

  const filter = { [filterBy as string]: filterWith };

  if (filterBy != "" && filter.status) {
    if (!transactionStatus.includes(filter.status)) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid Transcation Status",
          data: null,
        },
        {
          status: HttpStatusCode.BadRequest,
        },
      );
    }
  }

  var payment = await prisma.payments.findMany({
    where: {
      ...(filterBy === "status" && filter.status?.length! > 0
        ? filter.status == "ALL"
          ? undefined
          : filter
        : undefined),
      createdAt:
        startDate != null
          ? {
              gte: startDate.toDate(),
              lte: endDate?.toDate(),
            }
          : undefined,
    },
    select: {
      id: true,
      status: true,
      amount: true,
      orderId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
        },
      },
      transaction: {
        select: {
          quantity: true,
          status: true,
          createdAt: true,
          products: {
            select: {
              id: true,
              name: true,
              image1: true,
            },
          },
        },
      },
    },
  });
  const data: Data[] = payment.map((value, i) => {
    return {
      No: i + 1,
      Tanggal: moment(value.createdAt)
        .tz("Asia/Jakarta")
        .format("DD MMMM YYYY"),
      Nama: value.user.name,
      OrderId: value.orderId,
      Status: value.transaction[0].status,
      TotalHarga: value.amount,
    };
  });

  const field = ["No", "Tanggal", "Nama", "OrderId", "Status", "TotalHarga"];
  const wb = utils.book_new();
  const ws = utils.aoa_to_sheet([field]);

  data.forEach((row, rowIndex) => {
    const rowData = field.map((header) => row[header as keyof Data]);
    utils.sheet_add_aoa(ws, [rowData], { origin: -1 });
  });
  ws["!ref"] = utils.encode_range({
    s: { c: 0, r: 0 },
    e: { c: field.length - 1, r: data.length },
  });

  utils.book_append_sheet(wb, ws, "Data Transaction");
  const wbout = write(wb, { bookType: "xlsx", type: "binary" });
  const buffer = Buffer.from(wbout, "binary");

  const res = new NextResponse(buffer, {
    headers: {
      "Content-Disposition": `attachment; filename=Laporan_Transaction_${startDate?.format("DD-MM-YYYY")}-${endDate?.format("DD-MM-YYYY")}.xlsx`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
  return res;
}
