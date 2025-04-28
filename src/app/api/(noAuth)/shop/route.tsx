import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const session = await getServerSession(authOptions);

   var category = request.nextUrl.searchParams.get("category");
   var page: any = request.nextUrl.searchParams.get("page")!;
   var pageSize: any = request.nextUrl.searchParams.get("pageSize");

   var pageSizeInt = parseInt(pageSize);
   var products;
   var productTotal;

   const wishlistQuery =
      session != null
         ? {
              WishlistProduct: {
                 where: {
                    userId: parseInt(session.user.userId!),
                 },
              },
           }
         : {};

   if (category === null || category.length === 0) {
      productTotal = await prisma.products.count({});
      products = await prisma.products.findMany({
         where: {
            deleteAt: null,
            deleteBy: null,
         },
         select: {
            id: true,
            slug: true,
            name: true,
            priceIDR: true,
            Discount: {
               where: {
                  startDate: {
                     lte: moment().format(),
                  },
                  endDate: {
                     gte: moment().format(),
                  },
               },
            },
            weight: true,
            recommendation: true,
            image1: true,
            categoryId: true,
            descriptions: true,
            subDescriptions: true,
            ...wishlistQuery,
         },
         take: pageSizeInt,
         skip: (page - 1) * pageSize,
         orderBy: {
            updateAt: "desc",
         },
      });
   } else {
      var categoryId = parseInt(category!);
      productTotal = await prisma.products.count({
         where: { categoryId: categoryId },
      });

      products = await prisma.products.findMany({
         where: {
            deleteAt: null,
            deleteBy: null,
            categoryId: categoryId!,
         },
         select: {
            id: true,
            slug: true,
            name: true,
            recommendation: true,
            priceIDR: true,
            weight: true,
            Discount: {
               where: {
                  startDate: {
                     lte: moment().format(),
                  },
                  endDate: {
                     gte: moment().format(),
                  },
               },
            },
            image1: true,
            categoryId: true,
            maxOrder: true,
            descriptions: true,
            subDescriptions: true,
            ...wishlistQuery,
         },
         take: pageSizeInt,
         skip: (page - 1) * pageSize,
         orderBy: {
            updateAt: "desc",
         },
      });
   }

   if (session) {
      var wishlist = await prisma.wishlistProduct.findMany({
         where: {
            userId: parseInt(session.user.userId!),
         },
         select: {
            product: {
               select: {
                  id: true,
               },
            },
         },
      });
   }

   var data = {
      product: products,
      productTotal: productTotal,
      wishlist: wishlist! ?? null,
   };

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
