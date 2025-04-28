import prisma from "@/database/prisma";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { unlink } from "fs/promises";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  var getData = await prisma.promo.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });
  if (!getData) {
    return NextResponse.json(
      {
        error: true,
        message: "data in not found",
        data: null,
      },
      {
        status: HttpStatusCode.BadRequest,
      },
    );
  }
  if (fs.existsSync(getData.photo)) {
    unlink(getData.photo);
  }
  await prisma.promo.delete({
    where: {
      id: parseInt(params.id),
    },
  });
  return NextResponse.json({
    error: false,
    message: "promo Deleted successfully",
    data: null,
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  var getData = await prisma.promo.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });
  var promo = await prisma.promo.update({
    where: {
      id: getData?.id!,
    },
    data: {
      isActive: !getData?.isActive,
    },
  });
  return NextResponse.json({
    error: false,
    message: "promo updated successfully",
    data: promo,
  });
}
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  var promo = await prisma.promo.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: promo,
  });
}
