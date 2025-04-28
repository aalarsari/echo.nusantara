import prisma from "@/database/prisma";
import { RegisterValidation } from "@/lib/zod-schema/user";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import moment from "moment-timezone";
import { randomUUID } from "node:crypto";
import { SendEmail } from "@/lib/mail/email";
import { DateFormated } from "@/lib/date";
import EmailVerify from "@/lib/mail/template/emailVerify";
import { render } from "@react-email/components";

export async function POST(request: NextRequest) {
   var body = await request.formData();
   try {
      var register = RegisterValidation.parse(body);
      // checke email
      var user = await prisma.user.findFirst({
         where: {
            email: register.email!,
         },
      });
      if (user) {
         return NextResponse.json(
            {
               error: true,
               message: "Email has been registered",
               data: null,
            },
            {
               status: 400,
            },
         );
      }
      var user = await prisma.user.findFirst({
         where: {
            phone: register.phone!,
         },
      });
      if (user) {
         return NextResponse.json(
            {
               error: true,
               message: "No handphone has been registered",
               data: null,
            },
            {
               status: 400,
            },
         );
      }

      var createUser = await prisma.user.create({
         data: {
            name: register.name,
            email: register.email,
            password: await bcrypt.hash(register!.password, 10)!,
            phone: register.phone,
            active: false,
            photo: `${process.env.APP_URL!}/images/main.png`,
            createdBy: register.name,
            updateBy: register.name,
            createdAt: moment.tz().format(),
            updateAt: moment.tz().format(),
         },
      });
      if (createUser) {
         var token = `${randomUUID()}${randomUUID()}`.replace(/-/g, "");
         var sendMail = await SendEmail({
            to: createUser.email,
            subject: "activate your account",
            html: render(EmailVerify(token, createUser)),
         });

         if (sendMail) {
            await prisma.activeTokenRegister.create({
               data: {
                  token: token,
                  userId: createUser.id,
                  createdAt: DateFormated(),
                  updateAt: DateFormated(),
               },
            });
         }
      }
      return NextResponse.json({
         error: false,
         message: "register successfull",
         data: createUser,
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
      return NextResponse.json({ err });
   }
}
