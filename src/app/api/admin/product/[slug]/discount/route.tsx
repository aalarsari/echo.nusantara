import prisma from "@/database/prisma";
import moment from "moment-timezone";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { DiscountValidation } from "@/lib/zod-schema/discount";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
   var body = await request.json();

   try {
      const discountValidation = DiscountValidation.safeParse(body);
      if (discountValidation.error) {
         const validationError = fromZodError(discountValidation.error);
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
      const data = discountValidation.data;
      var product = await prisma.products.findFirst({
         where: { slug: params.slug },
         select: {
            id: true,
            slug: true,
            priceIDR: true,
         },
      });
      if (!product) {
         return NextResponse.json({
            error: true,
            message: "Product not found",
            data: null,
         });
      }
      var checkDiscountExist = await prisma.discount.findFirst({
         where: {
            productsId: product.id,
            startDate: {
               gte: moment(data?.startDate).format(),
            },
            endDate: {
               lte: moment(data?.endDate).format(),
            },
         },
      });
      if (checkDiscountExist) {
         return NextResponse.json(
            {
               error: true,
               message: "Product already have discount ",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }
      const productPrice = Math.abs(product.priceIDR - (data!.discount / 100) * product.priceIDR);
      var discountProduct = await prisma.discount.create({
         data: {
            productsId: product.id,
            discount: data!.discount / 100,
            subject: data!.subject,
            productPrice: productPrice,
            startDate: moment(data!.startDate).tz("Asia/Jakarta").startOf("d").format(),
            endDate: moment(data!.endDate).tz("Asia/Jakarta").endOf("d").format(),
            createdAt: moment.tz().format(),
            updateAt: moment.tz().format(),
         },
      });
      return NextResponse.json({
         error: false,
         message: "Discount Product created successfully",
         data: discountProduct,
      });
   } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
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
