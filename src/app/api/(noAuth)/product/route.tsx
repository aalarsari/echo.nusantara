import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET(request: NextRequest) {
   const req = request.nextUrl.searchParams.get("req"); // -> jangan di hapus  biar jangan jadi static
   var product = await prisma.products.findMany({
      where: {
         deleteAt: null,
         deleteBy: null,
      },
      select: {
         id: true,
         slug: true,
         subDescriptions: true,
         descriptions: true,
         name: true,
         priceIDR: true,
         weight: true,
         maxOrder: true,
         image1: true,
         recommendation: true,
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
      },
      orderBy: {
         recommendation: "desc",
      },
      take: 4,
   });

   var getDataBestSellerProduct = await prisma.transactions.findMany({
      where: {
         status: "DONE",
      },
      select: {
         id: true,
         quantity: true,
         products: {
            select: {
               id: true,
            },
         },
      },
   });

   var productBestSallerMap = new Map<number, number>();

   getDataBestSellerProduct.map((e) => {
      const currentQuantity = productBestSallerMap.get(e.products.id) || 0;
      productBestSallerMap.set(e.products.id, currentQuantity + e.quantity);
   });

   const sort = Array.from(productBestSallerMap.entries()).sort((a, b) => b[1] - a[1]);

   const productIdBestSeller = sort.map((e) => {
      return e[0];
   });

   var bestSeller: any[] = [];
   for (let i = 0; i < productIdBestSeller.slice(0, 4).length; i++) {
      const e = productIdBestSeller[i];

      var p = await prisma.products.findFirst({
         where: {
            id: e,
            deleteAt: null,
            deleteBy: null,
         },
         select: {
            id: true,
            slug: true,
            name: true,
            priceIDR: true,
            maxOrder: true,
            weight: true,
            image1: true,
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
         },
      });
      bestSeller.push(p);
   }
   var benner = await prisma.banner.findMany({
      where: {
         isActive: true,
      },
      select: {
         id: true,
         title: true,
         subtitle: true,
         path: true,
         category: true,
      },
      orderBy: {
         createdAt: "desc",
      },
      take: 5,
   });

   var category = await prisma.category.findMany({
      select: {
         id: true,
         name: true,
         Description: true,
         Products: {
            take: 3,
            select: {
               name: true,
               priceIDR: true,
               image1: true,
               image2: true,
               image3: true,
               image4: true,
               image5: true,
            },
         },
      },
   });
   var review = await prisma.review.findMany({});

   var data = {
      bestSeller: bestSeller,
      product: product,
      benner: benner,
      category: category,
      review: review,
   };

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
