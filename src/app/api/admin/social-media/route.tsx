import prisma from "@/database/prisma";
import { CreateLocationAttachment } from "@/lib/attachment";
import { authOptions } from "@/lib/nextAuth/auth";
import { SocialMediaValidation } from "@/lib/zod-schema/socialMedia";
import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function GET(request: NextRequest) {
  var data = await prisma.socialMedia.findMany({});
  return NextResponse.json({
    error: false,
    message: null,
    data: {
      socialMedia: data,
      count: data.length,
    },
  });
}

export async function POST(request: NextRequest) {
  var session = await getServerSession(authOptions);
  var body = await request.formData();
  try {
    var validation = SocialMediaValidation.safeParse(body);
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
    const data = validation.data;
    const directoryPath = CreateLocationAttachment(5);

    var image = data.image as File;
    var imageBuffer1 = Buffer.from(await image.arrayBuffer());
    var imageName1 = image.name.replaceAll(" ", "-");
    var imageUrl = `${process.env.APP_URL}/static/attachment/social-media/images/${imageName1}`;

    await writeFile(
      path.join(process.cwd(), `${directoryPath}/${imageName1}`),
      imageBuffer1 as unknown as Uint8Array,
    );
    var socialMedia = await prisma.socialMedia.create({
      data: {
        name: data.name,
        link: data.link,
        image: imageUrl,
        isActive: true,
      },
    });
    return NextResponse.json({
      error: false,
      message: null,
      data: socialMedia,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationError = fromZodError(err);
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
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: true,
          message: null,
          data: err,
        },
        {
          status: HttpStatusCode.BadRequest,
        },
      );
    }
  }
}
