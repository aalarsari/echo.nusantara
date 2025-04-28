import prisma from "@/database/prisma";
import { ContactValidations } from "@/lib/zod-schema/contact";
import { $Enums, Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest) {
   var body = await request.json();
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
         createdAt: moment.tz("Asia/Jakarta").format(),
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: payload,
   });
}
