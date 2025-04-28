import prisma from "@/database/prisma";
import { SendEmail } from "@/lib/mail/email";
import ResetPasswordTemplate from "@/lib/mail/template/resetPassword";
import { prepareResetPassword } from "@/lib/zod-schema/reset-password";
import { HttpStatusCode } from "axios";
import { randomUUID } from "crypto";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";
import { render } from "@react-email/components";

export async function POST(request: NextRequest) {
   const body = await request.json();
   const validation = prepareResetPassword.safeParse(body);
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
   // find email in user
   const user = await prisma.user.findFirst({
      where: {
         email: data.email,
      },
   });
   if (!user) {
      return NextResponse.json({
         error: true,
         message: "email not found",
      });
   }
   var token = `${randomUUID()}${randomUUID()}`.replace(/-/g, "");
   const expireAt = moment.tz("Asia/Jakarta").add({ minute: 15 });
   var sendMail = await SendEmail({
      to: user.email,
      subject: "activate your account",
      html: render(ResetPasswordTemplate(token, user)),
   });
   if (sendMail) {
      await prisma.resetPasswordToken.create({
         data: {
            userId: user.id,
            expireAt: expireAt.format(),
            token: token,
         },
      });
   }

   return NextResponse.json({
      error: false,
      message: "success make request reset password",
      data: user,
   });
}
