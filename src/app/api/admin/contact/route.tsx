import prisma from "@/database/prisma";
import { ContactValidations } from "@/lib/zod-schema/contact";
import { $Enums, Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import moment from "moment-timezone";

export async function GET(request: NextRequest) {
  var page: any = request.nextUrl.searchParams.get("page")!;
  var pageSize: any = request.nextUrl.searchParams.get("pageSize");
  var pageSizeInt = parseInt(pageSize);
  var data = await prisma.questionsUser.findMany({
    take: pageSizeInt,
    skip: (page - 1) * pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}

export async function POST(request: NextRequest) {
  var body = await request.json();
  try {
    const validation = ContactValidations.safeParse(body);
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
    var payload = await prisma.questionsUser.create({
      data: {
        title: data.title,
        email: data.email,
        nohandphone: data.nohandphone,
        nama: data.name,
        Desciriptions: data.description,
        category: data.category as $Enums.QuestionsUserCategory,
        createdAt: moment.tz().format(),
      },
    });
    return NextResponse.json({
      error: false,
      message: null,
      data: payload,
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
