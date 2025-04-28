import prisma from "@/database/prisma";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
   var user = await prisma.user.findFirst({
      where: {
         ActiveTokenRegister: {
            some: {
               createdAt: {
                  gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
               },
               token: params.token,
               activeAt: null,
            },
         },
      },
      select: {
         id: true,
         ActiveTokenRegister: {
            select: {
               id: true,
            },
         },
      },
   });
   if (user) {
      var token = await prisma.user.update({
         where: {
            id: user.id,
         },
         data: {
            active: true,
            ActiveTokenRegister: {
               update: {
                  where: {
                     id: user.ActiveTokenRegister[0].id,
                  },
                  data: {
                     activeAt: moment.tz().format(),
                  },
               },
            },
         },
      });
      return NextResponse.redirect(`${process.env.APP_URL}`);
   } else {
      throw new Error("someting wrong");
   }
}
