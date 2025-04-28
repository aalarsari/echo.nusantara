import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { AscDescValidation, NameOrderByValidation, UserValidation } from "@/lib/zod-schema/user";

import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";
import { GetLocation } from "@/lib/location";
import moment from "moment-timezone";

export async function POST(request: NextRequest) {
   var body = await request.formData();
   var validation = UserValidation.safeParse(body);
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
   var location = await GetLocation(data?.address!);

   var createUser = await prisma.user.create({
      data: {
         role: data.role,
         name: data.name,
         longitude: location.longitude,
         latitude: location.latitude,
         email: data.email,
         password: await bcrypt.hash(data!.password, 10)!,
         phone: data.phone,
         photo: `${process.env.APP_URL!}/images/main.png`,
         city: data.city,
         kecamatan: data.kecematan,
         kelurahan: data.kelurahan,
         address: data.address,
         postalCode: data.postalCode,
         createdBy: data.name,
         updateBy: data.name,
         createdAt: moment.tz().format(),
         updateAt: moment.tz().format(),
         active: true,
      },
   });
   return NextResponse.json({
      error: false,
      message: "register successfull",
      data: createUser,
   });
}

export async function GET(request: NextRequest) {
   var page: any = request.nextUrl.searchParams.get("page")!;
   var pageSize: any = request.nextUrl.searchParams.get("pageSize");

   var searchP: string = request.nextUrl.searchParams.get("search")!;

   var orderBy = request.nextUrl.searchParams.get("orderBy");
   var nameOrderBy = request.nextUrl.searchParams.get("nameOrderBy");

   var orderByValidation = AscDescValidation.safeParse(orderBy);
   var validationNameOrderBy = NameOrderByValidation.safeParse(nameOrderBy);

   var search: any = {
      OR: [
         {
            name: {
               contains: searchP!,
            },
         },
         {
            email: {
               contains: searchP!,
            },
         },
      ],
   };
   if (searchP.length == 0 || searchP == "undifined" || searchP == null || searchP == undefined) {
      search = {};
   }
   var filter: any = (filter = {
      orderBy: {
         name: orderByValidation.data!,
      },
   });
   if (validationNameOrderBy.data == "email") {
      filter = {
         orderBy: {
            email: orderByValidation.data!,
         },
      };
   }

   var pageSizeInt = parseInt(pageSize);

   var userTotal = await prisma.user.count({
      where: {
         role: {
            not: "ADMIN",
         },
         ...search,
      },
   });

   var users = await prisma.user.findMany({
      where: {
         role: {
            not: "ADMIN",
         },
         ...search,
      },
      select: {
         id: true,
         name: true,
         email: true,
         phone: true,
         address: true,
      },
      ...filter,
      take: pageSizeInt,
      skip: (page - 1) * pageSize,
   });

   var data = {
      user: users,
      userTotal: userTotal,
   };
   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
