import prisma from "@/database/prisma";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { unlink } from "fs/promises";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  var getData = await prisma.banner.findFirst({
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
  if (fs.existsSync(getData.path)) {
    unlink(getData.path);
  }
  await prisma.banner.delete({
    where: {
      id: parseInt(params.id),
    },
  });
  return NextResponse.json({
    error: false,
    message: "Banner Deleted successfully",
    data: null,
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {

  
  var getData = await prisma.banner.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });
  var banner = await prisma.banner.update({
    where: {
      id: getData?.id!,
    },
    data: {
      isActive: !getData?.isActive,
    },
  });
  return NextResponse.json({
    error: false,
    message: "Banner updated successfully",
    data: banner,
  });
}
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  var banner = await prisma.banner.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: banner,
  });
}
