import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { cartValidtion } from "@/lib/zod-schema/cart";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { totalHarga } from "@/lib/totalCart/totalCart";
import { GetLocationPickup } from "@/lib/shipment";
import { GetShipmentPrice } from "@/lib/shipment-price";
import moment from "moment-timezone";

export async function GET(request: NextRequest) {
   const session = await getServerSession(authOptions);
   var cart = await prisma.cart.findMany({
      where: {
         userId: parseInt(session?.user.userId!),
         isCheckOut: false,
         // isBuyNow: false,
      },
      select: {
         id: true,
         buyQuantity: true,
         product: {
            select: {
               id: true,
               name: true,
               weight: true,
               slug: true,
               image1: true,
               descriptions: true,
               priceIDR: true,
            },
         },
      },
   });

   var total = totalHarga(cart);

   const user = await prisma.user.findFirst({
      where: {
         id: parseInt(session?.user.userId!),
      },
   });

   const products: Products[] = [];
   cart.map((proudct, i) => {
      var data = {
         name: proudct.product.name,
         quantity: proudct.buyQuantity,
         // category: proudct.product.category,
         value: proudct.product.priceIDR,
         weight: proudct.product.weight,
      };
      products.push(data);
   });

   var locationPickup = await prisma.locationPickup.findFirst({
      where: {
         address: {
            contains:
               "Senopati Suites, Jl. Senopati No.41, RT.8/RW.2, Senayan, Kebayoran Baru, South Jakarta City, Jakarta 12190, Kebayoran Baru, Jakarta Selatan, DKI Jakarta, 12190",
            mode: "insensitive",
         },
      },
   });

   if (!locationPickup) {
      var getLocationPickup = await GetLocationPickup();
      locationPickup = await prisma.locationPickup.create({
         data: {
            postalCode: getLocationPickup!.postal_code,
            contactName: getLocationPickup!.contact_name,
            contactPhone: getLocationPickup!.contact_phone,
            longitude: getLocationPickup?.coordinate.longitude!,
            latitude: getLocationPickup?.coordinate.latitude!,
            address: getLocationPickup!.address,
            createdBy: "system",
            updatedBy: "system",
         },
      });
   }

   const couriers = "gojek,anteraja,sicepat,jnt,jne,lion,tiki,lalamove";

   const payload: ShipmentPrice = {
      origin_postal_code: locationPickup.postalCode!,
      origin_latitude: locationPickup!.latitude,
      origin_longitude: locationPickup!.longitude,
      destination_postal_code: parseInt(user?.postalCode!),
      destination_latitude: user?.latitude!,
      destination_longitude: user?.longitude!,
      couriers: couriers!,
      items: products,
   };
   var shipmentPrice = await GetShipmentPrice(payload);
   if (!shipmentPrice) {
      return NextResponse.json(
         {
            error: true,
            message: "Somethings went wrong",
            data: null,
         },
         {
            status: HttpStatusCode.BadGateway,
         },
      );
   }
   const cartIds: number[] = [];
   cart.map((value, index) => {
      cartIds.push(value.id);
   });
   var data = {
      count: cart.length,
      cart: cart ?? null,
      cartids: cartIds,
      shipmentPrice: shipmentPrice?.pricing,
      total: total ?? null,
   };

   return NextResponse.json({
      error: false,
      message: null,
      data: data,
   });
}
export async function POST(request: NextRequest) {
   const session = await getServerSession(authOptions);

   var body = await request.json();

   try {
      var validation = cartValidtion.parse(body);

      var buyQuantity = validation.quantity;

      // check productId sudah ada
      var checkData = await prisma.cart.findFirst({
         where: {
            productsId: validation.productId,
            isCheckOut: false,
            isBuyNow: false,
            userId: parseInt(session?.user.userId!),
         },
      });

      if (checkData) {
         buyQuantity = checkData.buyQuantity + validation.quantity;
      }

      var product = await prisma.products.findFirst({
         where: {
            id: validation.productId,
            stock: {
               gt: buyQuantity,
            },
         },
      });

      if (!product) {
         return NextResponse.json(
            {
               error: false,
               message: "out of stock",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }

      if (checkData) {
         await prisma.cart.update({
            where: {
               id: checkData.id,
            },
            data: {
               buyQuantity: buyQuantity,
            },
         });
      } else {
         await prisma.cart.create({
            data: {
               productsId: validation.productId,
               buyQuantity: buyQuantity,
               userId: parseInt(session?.user.userId!),
               createdAt: moment.tz("Asia/Jakarta").format(),
            },
         });
      }

      var cart = await prisma.cart.findMany({
         where: {
            userId: parseInt(session?.user.userId!),
         },
         select: {
            id: true,
            buyQuantity: true,
            product: {
               select: {
                  id: true,
                  name: true,
                  slug: true,
                  priceIDR: true,
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
                     take: 1,
                     select: {
                        discount: true,
                     },
                  },
               },
            },
         },
         orderBy: {
            createdAt: "desc",
         },
      });
      var total = totalHarga(cart);

      var data = {
         count: cart.length,
         cart: cart ?? null,
         total: total ?? null,
      };
      return NextResponse.json({
         error: false,
         message: "cart updated successfully",
         data: data,
      });
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
