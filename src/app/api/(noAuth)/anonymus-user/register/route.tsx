import prisma from "@/database/prisma";
import { GetLocation } from "@/lib/location";
import bcrypt from "bcrypt";
import { AnonymusRegisterValidation } from "@/lib/zod-schema/user";
import { HttpStatusCode } from "axios";
import { randomUUID } from "crypto";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
   const body = await request.json();
   var password = `${randomUUID()}`.replace(/-/g, "").toLowerCase().substring(0, 6);
   var validation = AnonymusRegisterValidation.safeParse(body);

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
   // checke email
   var user = await prisma.user.findFirst({
      where: {
         email: data?.email!,
      },
   });

   if (user) {
      return NextResponse.json({
         error: true,
         message: "Email already exists",
         data: null,
      });
   }
   var location;

   if (data?.address != "") {
      location = await GetLocation(data?.address!);
   }

   const dataUser = await prisma.user.create({
      data: {
         name: data?.name!,
         email: data?.email!,
         password: await bcrypt.hash(password, 10)!,

         phone: data?.phone!,
         active: true,
         address: data?.address,
         city: data?.city,
         postalCode: data?.postalCode,
         latitude: data?.address != "" ? location?.latitude! : null,
         longitude: data?.address != "" ? location?.longitude! : null,
         photo: `${process.env.APP_URL!}/images/main.png`,
         createdBy: data?.name!,
         updateBy: data?.name!,
         createdAt: moment.tz().format(),
         updateAt: moment.tz().format(),
      },
   });
   return NextResponse.json({
      error: false,
      message: "Success",
      data: {
         email: dataUser.email,
         password: password,
         id: dataUser.id,
      },
   });
}
