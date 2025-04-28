import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
   var product = await prisma.products.findFirst({
      where: { slug: params.slug },
      select: {
         id: true,
         name: true,
         descriptions: true,
         subDescriptions: true,
         priceIDR: true,
         weight: true,
         stock: true,
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
         maxOrder: true,
         category: {
            select: {
               name: true,
               id: true,
            },
         },
         image1: true,
         image2: true,
         image3: true,
         image4: true,
         image5: true,
         WishlistProduct: {
            select: {
               product: {
                  select: {
                     id: true,
                     name: true,
                  },
               },
            },
         },
         recommendation: true,
         size: true,
         ReviewProduct: {
            select: {
               rate: true,
               review: true,
               updatedAt: true,
               createdAt: true,
               user: {
                  select: {
                     id: true,
                     name: true,
                  },
               },
            },
         },
      },
   });

  //  var total = product?.ReviewProduct!.reduce((subTotal, review) => {
  //     return subTotal + review.rate!;
  //  }, 0);
  //  var rateMean = total! / product!.ReviewProduct!.length;
  //  product!.rateMean = rateMean;

   return NextResponse.json({
      error: false,
      message: null,
      data: product,
   });
}
