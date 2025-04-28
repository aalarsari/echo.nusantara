import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import moment from "moment-timezone";
import prisma from "@/database/prisma";
import { resetPasswordValidation } from "@/lib/zod-schema/reset-password";
import { HttpStatusCode } from "axios";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
   const token = params.token;
   const now = moment.tz("Asia/Jakarta");
   // find token
   const find = await prisma.resetPasswordToken.findFirst({
      where: {
         token: token,
         expireAt: {
            gte: now.format(),
         },
         useAt: null,
      },
   });
   if (!find) {
      return redirect("/not-found");
   }

   return redirect(`/change-password?token=${token}`);
}

export async function PUT(request: NextRequest, { params }: { params: { token: string } }) {
   const token = params.token;
   const now = moment.tz("Asia/Jakarta");
   const body = await request.json();
   const validation = resetPasswordValidation.safeParse(body);
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
   await prisma.resetPasswordToken.update({
      where: {
         token: token,
      },
      data: {
         useAt: now.format(),
      },
   });
   const change = await prisma.user.update({
      where: {
         id: user.id,
      },
      data: {
         password: await bcrypt.hash(data!.password, 10)!,
      },
   });
   return NextResponse.json({
      error: false,
      message: "password successfuly change",
   });
}
