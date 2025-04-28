import prisma from "@/database/prisma";
import moment from "moment-timezone";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { GetLocationPickup } from "@/lib/shipment";
import { GetShipmentPrice } from "@/lib/shipment-price";
import { cartValidtion } from "@/lib/zod-schema/cart";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function GET(request: NextRequest) {
   const session = await getServerSession(authOptions);

   var cartId = request.nextUrl.searchParams.get("cartId");

   if (!cartId) {
      return NextResponse.json(
         {
            error: true,
            message: "cart data must exist",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }
   const searchCart = await prisma.cart.findMany({
      where: {
         userId: parseInt(session?.user.userId!),
         // isCheckOut: false,
         id: parseInt(cartId!),
      },
      select: {
         id: true,
         buyQuantity: true,
         product: {
            select: {
               id: true,
               priceIDR: true,
               name: true,
               image1: true,
               descriptions: true,
               subDescriptions: true,
               weight: true,
               category: {
                  select: {
                     name: true,
                  },
               },
               maxOrder: true,
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
                  take: 1,
               },
            },
         },
         user: true,
      },
   });
   var total = 0;
   var priceProduct = 0;
   var discount;
   for (let i = 0; i < searchCart.length; i++) {
      priceProduct = Math.ceil(searchCart[i].product.priceIDR);
      var product: Products = searchCart[i].product;
      product.quantity = searchCart[i].buyQuantity;

      var newStock = product.stock! - product.quantity;
      if (newStock < 0) {
         newStock = 0;
      }
      if (newStock == 0) {
         return NextResponse.json(
            {
               error: true,
               message: "out of stock",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }

      if (searchCart[i].product.Discount.length > 0) {
         discount = searchCart[i].product.Discount;

         for (let j = 0; j < discount.length; j++) {
            if (discount[j].productPrice) {
               priceProduct = discount[j].productPrice!;
            }
         }
      }
      product.price = priceProduct;
      total += product.price * product.quantity;
   }

   const user = await prisma.user.findFirst({
      where: {
         id: parseInt(session?.user.userId!),
      },
   });

   const products: Products[] = [];
   searchCart.map((proudct, i) => {
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

   var data = {
      count: searchCart.length,
      cart: searchCart ?? null,
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
      var validation = cartValidtion.safeParse(body);
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
      var buyQuantity = data.quantity;

      var product = await prisma.products.findFirst({
         where: {
            id: data.productId,
            stock: {
               gt: buyQuantity,
            },
         },
      });
      if (!product) {
         return NextResponse.json(
            {
               error: true,
               message: "out of stock",
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }

      var payload = await prisma.cart.create({
         data: {
            isBuyNow: true,
            productsId: data.productId,
            buyQuantity: buyQuantity,
            userId: parseInt(session?.user.userId!),
            createdAt: moment.tz().format(),
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
      });

      return NextResponse.json({
         error: false,
         message: "cart updated successfully",
         data: payload,
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
