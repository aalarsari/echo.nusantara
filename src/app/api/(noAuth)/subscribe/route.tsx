import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { SendEmail } from "@/lib/mail/email";
import SendNotificationSubscribe from "@/lib/mail/template/subscribe";
import { SubscriberValidation } from "@/lib/zod-schema/subscriber";
import { Prisma } from "@prisma/client";
import { render } from "@react-email/components";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import moment from "moment-timezone";
export async function POST(request: NextRequest) {
   var body = await request.json();
   try {
      var validation = SubscriberValidation.parse(body);

      // check email
      var check = await prisma.subscriber.findFirst({
         where: {
            email: validation.email.trim(),
         },
      });
      if (check) {
         return NextResponse.json(
            {
               error: true,
               message: "Duplicate email",
               data: null,
            },
            { status: HttpStatusCode.BadRequest },
         );
      }

      var subscriber = await prisma.subscriber.create({
         data: {
            email: validation.email.trim(),
            createdAt: moment.tz().format(),
         },
         select: {
            id: true,
            email: true,
         },
      });
      var a = await SendEmail({
         to: validation.email,
         subject: "Anda telah berhasil subscribe",
         html: render(SendNotificationSubscribe()),
      });

      return NextResponse.json(
         {
            error: false,
            message: "Subscribe succesfull",
            data: subscriber,
         },
         { status: HttpStatusCode.OK },
      );
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
      } else if (err) {
         const errorWithCode = err as {
            code?: string;
            responseCode?: number;
            message: string;
         };

         if (errorWithCode.code === "ECONNREFUSED") {
            return NextResponse.json(
               {
                  error: true,
                  message: "Connection refused. Please check your SMTP server.",
                  data: null,
               },
               {
                  status: HttpStatusCode.OK, // 500 Internal Server Error
               },
            );
         } else if (errorWithCode.responseCode === 535) {
            return NextResponse.json(
               {
                  error: true,
                  message: "Authentication failed. Invalid login credentials.",
                  data: null,
               },
               {
                  status: HttpStatusCode.OK, // 401 Unauthorized
               },
            );
         } else {
            return NextResponse.json(
               {
                  error: true,
                  message: "An unknown error occurred.",
                  data: errorWithCode.message,
               },
               {
                  status: HttpStatusCode.OK, // 500 Internal Server Error
               },
            );
         }
      }
   }
}
