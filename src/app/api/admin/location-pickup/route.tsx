import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { GetLocation } from "@/lib/location";
import { authOptions } from "@/lib/nextAuth/auth";
import { CreateLocationPickupValidation } from "@/lib/zod-schema/location-pickup";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest) {
   const body = await request.json();
   const session = await getServerSession(authOptions);
   var validation = CreateLocationPickupValidation.safeParse(body);
   if (validation.error) {
      const error = fromZodError(validation.error);
      return NextResponse.json(
         {
            error: true,
            message: error,
            data: null,
         },
         {
            status: HttpStatusCode.UnprocessableEntity,
         },
      );
   }
   const data = validation.data;
   const location = await GetLocation(data.address);
   const create = await prisma.locationPickup.create({
      data: {
         postalCode: data.postalCode,
         contactName: data.contactName,
         contactPhone: data.contactPhone,
         longitude: location.longitude,
         latitude: location.latitude,
         address: data.address,
         createdBy: session?.user.name!,
         updatedBy: session?.user.name!,
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: create,
   });
}

export async function GET(request: NextRequest) {
   var page: any = request.nextUrl.searchParams.get("page")!;
   var pageSize: any = request.nextUrl.searchParams.get("pageSize");
   var pageSizeInt = parseInt(pageSize);

   var searchP: string = request.nextUrl.searchParams.get("search")!;

   var search: any = {
      name: {
         mode: "insensitive",
         contains: searchP,
      },
   };

   if (searchP.length == 0 || searchP == "undifined" || searchP == null || searchP == undefined) {
      search = {};
   }

   const count = await prisma.locationPickup.count({
      sActive: true,
      ...search,
   });
   const locationPickup = await prisma.locationPickup.findFirst({
      where: {
         isActive: true,
         ...search,
      },
      take: pageSizeInt,
      skip: (page - 1) * pageSize,
   });

   var data = {
      count: count,
      locationPickup: locationPickup,
   };

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
