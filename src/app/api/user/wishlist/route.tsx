import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { WishlistValidation } from "@/lib/zod-schema/wishlist";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";
import moment from "moment-timezone";

export async function POST(request: NextRequest) {
   var session = await getServerSession(authOptions);
   var body = await request.json();
   var validation = WishlistValidation.safeParse(body);
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
   var checkWishlist = await prisma.wishlistProduct.findFirst({
      where: {
         userId: parseInt(session?.user.userId!),
         productsId: data.productId,
      },
   });
   if (!checkWishlist) {
      var wishlist = await prisma.wishlistProduct.create({
         data: {
            productsId: data.productId,
            userId: parseInt(session?.user.userId!),
            upadateAt: moment.tz().format(),
            createdAt: moment.tz().format(),
         },
         include: {
            product: true,
         },
      });
      return NextResponse.json({
         error: false,
         message: "add wishlist product successfull",
         data: wishlist,
      });
   } else {
      await prisma.wishlistProduct.delete({
         where: {
            id: checkWishlist.id,
         },
      });
      return NextResponse.json({
         error: false,
         message: "Wishlish Product updated successfully",
         data: null,
      });
   }
}

export async function GET(request: NextRequest) {
   var session = await getServerSession(authOptions);

   var wishlist = await prisma.wishlistProduct.findMany({
      where: {
         userId: parseInt(session?.user.userId!),
      },
      select: {
         product: {
            select: {
               name: true,
               priceIDR: true,
               image1: true,
            },
         },
      },
   });
   return NextResponse.json({
      error: false,
      message: null,
      data: wishlist,
   });
}
