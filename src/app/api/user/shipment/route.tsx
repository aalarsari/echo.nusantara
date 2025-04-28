import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { GetLocationPickup } from "@/lib/shipment";
import { GetShipmentPrice } from "@/lib/shipment-price";
import { CreateShipment } from "@/lib/zod-schema/shipment";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest) {
   var session = await getServerSession(authOptions);
   const body = await request.json();
   const validation = CreateShipment.safeParse(body);

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

   // get user address
   var user = await prisma.user.findFirst({
      where: {
         id: parseInt(session?.user.userId!),
      },
   });

   const data = validation.data;

   const getCartDetail = await prisma.cart.findMany({
      where: {
         id: { in: data.cartIds },
         //  userId: parseInt(session?.user.userId!),
      },
      select: {
         id: true,
         buyQuantity: true,
         product: {
            select: {
               id: true,
               priceIDR: true,
               name: true,
               weight: true,
               category: {
                  select: {
                     name: true,
                  },
               },
               maxOrder: true,
               stock: true,
               Discount: {
                  select: {
                     discount: true,
                     startDate: true,
                     endDate:true
                  },
               },
            },
         },
      },
   });
   const products: Products[] = [];
   getCartDetail.map((proudct, i) => {
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

   const couriers = data.couriers?.join(",");

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

   return NextResponse.json(
      {
         error: false,
         message: null,
         data: shipmentPrice,
      },
      {
         status: HttpStatusCode.Ok,
      },
   );
}

