import prisma from "@/database/prisma";
import moment from "moment-timezone";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { GetLocation } from "@/lib/location";
import { UserUpdateValidation } from "@/lib/zod-schema/user";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
   var body = await request.json();
   var validation = UserUpdateValidation.safeParse(body);
   var location;
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
   if (data?.address != "") {
      location = await GetLocation(data?.address!);
   }
   var user = await prisma.user.findFirst({
      where: {
         id: parseInt(params.userId),
      },
   });

   var updateUser = await prisma.user.update({
      where: {
         id: parseInt(params.userId),
      },
      data: {
         name: data?.name != "" ? data?.name! : user?.name!,
         email: data?.email != "" ? data?.email! : user?.email!,
         phone: data?.phone != "" ? data?.phone! : user?.phone!,
         gander: data?.gander != undefined || data?.gander != null ? data?.gander! : user?.gander!,
         kecamatan: data?.kecematan != "" ? data?.kecematan! : user?.kecamatan!,
         kelurahan: data?.kelurahan != "" ? data?.kelurahan! : user?.kelurahan!,
         address: data?.address != "" ? data?.address! : user?.address!,
         latitude: data?.address != "" ? location?.latitude! : user?.latitude!,
         longitude: data?.address != "" ? location?.longitude! : user?.longitude!,
         city: data?.city != "" ? data?.city! : user?.city!,
         postalCode: data?.postalCode != "" ? data?.postalCode! : user?.postalCode!,
         updateBy: data?.name,
         updateAt: moment.tz().format(),
      },
   });
   return NextResponse.json({
      error: false,
      message: "user update",
      data: updateUser,
   });
}
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
   var user = await prisma.user.findFirst({
      where: {
         id: parseInt(params.userId),
      },
      select: {
         id: true,
         name: true,
         email: true,
         phone: true,
         address: true,
         city: true,
         postalCode: true,
         photo: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: user,
   });
}
