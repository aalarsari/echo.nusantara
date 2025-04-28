import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { Prisma } from "@prisma/client";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
   var session = await getServerSession(authOptions);
   try {
      var checkData = await prisma.complaint.findFirst({
         where: {
            id: parseInt(params.id),
         },
      });
      if (!checkData) {
         return NextResponse.json(
            {
               error: true,
               message: "data not found",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
      if (checkData.status !== "NEW") {
         return NextResponse.json(
            {
               error: true,
               message: "incorrect status",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
      var complaint = await prisma.complaint.update({
         where: {
            id: parseInt(params.id),
            status: "NEW",
            updateAt: moment.tz().format(),
            updateBy: session?.user.name!,
         },
         data: {
            status: "PROGRESS",
         },
      });
      return NextResponse.json(
         {
            error: false,
            message: "complaint updated successfully",
            data: complaint,
         },
         {
            status: HttpStatusCode.OK,
         },
      );
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
   }
}
