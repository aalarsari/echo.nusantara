import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { CategoryValidation } from "@/lib/zod-schema/category";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function GET(request: NextRequest) {
   var category = await prisma.category.findMany();
   return NextResponse.json({
      error: false,
      message: null,
      data: category,
   });
}

export async function POST(request: NextRequest) {
   var body = await request.json();
   try {
      var validation = CategoryValidation.safeParse(body);
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
      var category = await prisma.category.create({
         data: {
            name: data!.name,
            Description: data!.description,
         },
      });
      return NextResponse.json({
         error: false,
         message: "Category created successfully",
         data: category,
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
