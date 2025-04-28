import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { SendEmail } from "@/lib/mail/email";
import SendNotificationSubscribe from "@/lib/mail/template/subscribe";
import { SubscriberValidation } from "@/lib/zod-schema/subscriber";
import { render } from "@react-email/components";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";
import moment from "moment-timezone";

export async function POST(request: NextRequest) {
   var body = await request.json();
   var validation = SubscriberValidation.safeParse(body);

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
   // check email
   var check = await prisma.subscriber.findFirst({
      where: {
         email: data.email.trim(),
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
         email: data.email.trim(),
         createdAt: moment.tz().format(),
      },
      select: {
         id: true,
         email: true,
      },
   });
   await SendEmail({
      to: data.email,
      subject: "Anda telah berhasil subscribe",
      html: render(SendNotificationSubscribe()),
   });

   return NextResponse.json(
      {
         error: false,
         message: "Subscribe succesfull",
         data: subscriber,
      },
      {
         status: HttpStatusCode.OK,
      },
   );
}

export async function GET(request: NextRequest) {
   var page: any = request.nextUrl.searchParams.get("page")!;
   var pageSize: any = request.nextUrl.searchParams.get("pageSize");
   var pageSizeInt = parseInt(pageSize);

   var data = await prisma.subscriber.findMany({
      take: pageSizeInt,
      skip: (page - 1) * pageSize,
      orderBy: {
         createdAt: "asc",
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
