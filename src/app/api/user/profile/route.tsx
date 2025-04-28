import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { GetLocation } from "@/lib/location";
import { authOptions } from "@/lib/nextAuth/auth";
import { profileUpdate } from "@/lib/zod-schema/profile";
import { Prisma } from "@prisma/client";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function PUT(request: NextRequest) {
   const session = await getServerSession(authOptions);
   var body = await request.json();
   var validation = profileUpdate.safeParse(body);

   
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

   // check user
   var user = await prisma.user.findFirst({
      where: {
         id: parseInt(session?.user.userId!),
      },
   });
   var location;

   if (data.address != "") {
      location = await GetLocation(data?.address!);
   }
   var updateUser = await prisma.user.update({
      where: {
         id: parseInt(session?.user.userId!),
      },
      data: {
         name: data.name != "" ? data.name! : user?.name!,
         email: data.email != "" ? data.email! : user?.email!,
         phone: data.phone != "" ? data.phone! : user?.phone!,
         gander: data.gander != undefined || data.gander != null ? data.gander! : user?.gander!,
         address: data.address != "" ? data.address! : user?.address!,
         city: data.city != "" ? data.city! : user?.city!,
         postalCode: data.postalCode != "" ? data.postalCode! : user?.postalCode!,
         latitude: data.address != "" ? location?.latitude! : user?.latitude!,
         longitude: data.address != "" ? location?.longitude! : user?.longitude!,
         updateBy: data.name,
         updateAt: moment.tz().format(),
      },
      select: {
         id: true,
         name: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: "profile update",
      data: user,
   });
}

export async function GET(request: NextRequest) {
   const session = await getServerSession(authOptions);

   var user = await prisma.user.findFirst({
      where: {
         id: parseInt(session?.user.userId!),
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: user,
   });
}
