import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { profileUpdatePassword } from "@/lib/zod-schema/profile";

export async function PUT(request: NextRequest) {
   const session = await getServerSession(authOptions);

   var body = await request.json();

   var validation = profileUpdatePassword.safeParse(body);
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
   var checkUser = await prisma.user.findFirst({
      where: {
         id: parseInt(session?.user.userId!),
      },
   });
   var compareHash = await bcrypt.compare(data?.oldPassword!, checkUser!.password!);
   if (!compareHash) {
      return NextResponse.json({
         error: true,
         message: "wrong old password",
         data: null,
      });
   }

   var user = await prisma.user.update({
      where: {
         id: parseInt(session?.user.userId!),
      },
      data: {
         password: await bcrypt.hash(data!.password, 10)!,
      },
      select: {
         id: true,
         name: true,
         email: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: "update password successfull",
      data: user,
   });
}
