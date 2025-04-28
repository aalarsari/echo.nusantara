import { BannerValidation } from "@/lib/zod-schema/banner";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import prisma from "@/database/prisma";
import { HttpStatusCode } from "axios";
import { fromZodError } from "zod-validation-error";
import { CreateLocationAttachment } from "@/lib/attachment";
import moment from "moment-timezone";

export async function POST(request: NextRequest) {
  var body = await request.formData();
  const directoryPath = CreateLocationAttachment(2);
  var validation = BannerValidation.safeParse(body);
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

  var image1 = data?.photo as File;
  var imageBuffer1 = Buffer.from(await image1.arrayBuffer());
  var imageName1 = image1.name.replaceAll(" ", "-");
  await writeFile(
    path.join(process.cwd(), `${directoryPath}/${imageName1}`),
    imageBuffer1 as unknown as Uint8Array,
  );
  var banner = await prisma.banner.create({
    data: {
      title: data?.title!,
      subtitle: data?.subtitle!,
      category: data?.category,
      path: `${process.env.APP_URL}/static/attachment/banner/images/${imageName1}`,
      createdAt: moment.tz().format(),
    },
  });
  return NextResponse.json({
    error: false,
    message: "Banner created successfully",
    data: banner,
  });
}

export async function GET(request: NextRequest) {
  var banner = await prisma.banner.findMany({
    select: {
      id: true,
      title: true,
      subtitle: true,
      path: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: banner,
  });
}
