import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { checkoutValidation } from "@/lib/zod-schema/transaction";
import { $Enums, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";
import { PaymentDataCashless } from "@/lib/payment";
import { CreateDraftShipment, GetLocationPickup } from "@/lib/shipment";
import { generateRandomString } from "@/lib/randomString";
import moment from "moment";
import { SendEmail } from "@/lib/mail/email";
import Invoice from "@/lib/pdf/template/invoice";
import ReactPDF from "@react-pdf/renderer";
import { CreateLocationAttachment } from "@/lib/attachment";
import Nota from "@/lib/mail/template/nota";
import { render } from "@react-email/components";

/**
 * Handles the POST request for checking out a user's cart.
 * @param request - The incoming request object.
 * @returns A JSON response indicating the result of the checkout process.
 */
export async function POST(request: NextRequest) {
   const session = await getServerSession(authOptions);

   var body = await request.json();
   var validation = checkoutValidation.safeParse(body);
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

   var data = validation.data;
   var getcartDetail = await prisma.cart.findMany({
      where: {
         id: { in: data.cartIds },
         userId: parseInt(session?.user.userId!),
         isCheckOut: false,
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
               },
            },
         },
      },
   });

   var user = await prisma.user.findFirst({
      where: {
         id: parseInt(session?.user.userId!),
      },
   });
   if (!user?.postalCode && !user?.city && !user?.address && !user?.country) {
      return NextResponse.json(
         {
            error: true,
            message: "postal code, city, address, are needed to continue this action ",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }

   // Initialize variables for total price, product price, discount, and an array to store products
   var total = 0;
   var priceProduct = 0;
   var discount;
   var products: Products[] = [];

   // Loop through each item in the cart details
   for (let i = 0; i < getcartDetail.length; i++) {
      // Round up the product price to the nearest integer
      priceProduct = Math.ceil(getcartDetail[i].product.priceIDR);

      // Get the product details and set the quantity
      var product: Products = getcartDetail[i].product;
      product.quantity = getcartDetail[i].buyQuantity;

      // Calculate the new stock after the purchase
      var newStock = product.stock! - product.quantity;

      // Check if the new stock is less than 0, if so, return an error response
      if (newStock < 0) {
         newStock = 0;
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

      // Check if the quantity exceeds the maximum order limit, if so, return an error response
      if (!(product.maxOrder! > product.quantity)) {
         return NextResponse.json(
            {
               error: true,
               message: `${product.name} cannot be ordered beyond ${product.maxOrder}`,
               data: null,
            },
            {
               status: HttpStatusCode.BadRequest,
            },
         );
      }

      // Update the product stock in the database
      await prisma.products.update({
         where: {
            id: product.id,
         },
         data: {
            stock: newStock,
         },
      });

      // Check if the product has any discounts
      if (getcartDetail[i].product.Discount.length > 0) {
         discount = getcartDetail[i].product.Discount;

         // Loop through each discount and apply it if it is not expired
         for (let j = 0; j < discount.length; j++) {
            if (discount[j].productPrice) {
               priceProduct = discount[j].productPrice!;
            }
         }
      }

      // Set the product price and add it to the total
      product.price = priceProduct;
      total += product.price * product.quantity;

      // Add the product to the products array
      products.push(product);
   }
   // payments start

   //prepare data fot payment
   // create order Id
   const lastPayment = await prisma.payments.findFirst({
      where: {
         createdAt: {
            gte: moment().startOf("day").toDate(),
            lte: moment().endOf("day").toDate(),
         },
      },
      select: {
         orderId: true,
         createdAt: true,
      },
      orderBy: {
         createdAt: "desc",
      },
   });

   const tempOrderId = `${moment.tz("Asia/Jakarta").format("YYYYMMDD")}web001`;

   if (lastPayment) {
      var lastOrderId = lastPayment?.orderId;
      const orderNumber = parseInt(lastOrderId.slice(-3), 10) + 1;
      const formattedOrderNumber = orderNumber.toString().padStart(3, "0");
      var orderId = `${moment.tz("Asia/Jakarta").format("YYYYMMDD")}web${formattedOrderNumber}`.toUpperCase();
   } else {
      var orderId = tempOrderId.toUpperCase();
   }

   var tokenSuccess = generateRandomString(10);
   var tokenFailed = generateRandomString(10);

   if (getcartDetail.length <= 0) {
      return NextResponse.json(
         {
            error: true,
            message: "cart already checkout",
            data: null,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }
   //get location pickup
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
   const origin: OriginShipmet = {
      contactName: locationPickup?.contactName,
      contactPhone: locationPickup?.contactPhone,
      address: locationPickup?.address,
      postalCode: locationPickup?.postalCode!,
      coordinate: {
         latitude: locationPickup?.latitude!,
         longitude: locationPickup?.longitude!,
      },
   };

   var couriers = await prisma.couriers.findFirst({
      where: {
         name: data.couriersCode,
         type: data.courierServiceCode,
      },
   });

   // create draft shipment
   var shipmentCreateDraft = await CreateDraftShipment(origin, user, couriers!, products);

   total = Math.abs(total) + Math.abs(shipmentCreateDraft?.price!);

   //payment
   const pay = await PaymentDataCashless(total, orderId, tokenSuccess, tokenFailed);
   const paymentData = pay?.data.data.response;

   if (pay?.status != HttpStatusCode.OK) {
      return NextResponse.json(
         {
            error: true,
            messagee: "error to checkout",
            data: paymentData,
         },
         {
            status: HttpStatusCode.BadRequest,
         },
      );
   }

   const payment = await prisma.payments.create({
      data: {
         orderId: orderId,
         amount: total,
         status: $Enums.PaymentStatus.PENDING,
         link: paymentData.generatedUrl,
         userId: parseInt(session?.user.userId!),
         createdBy: session?.user.name!,
         updatedBy: session?.user.name!,
         tokenSuccess: tokenSuccess,
         tokenFailed: tokenFailed,
         Shipment: {
            create: {
               price: shipmentCreateDraft?.price!,
               couriers: {
                  connect: {
                     id: couriers?.id!,
                  },
               },
               status: shipmentCreateDraft?.status!,
               shipmentCode: shipmentCreateDraft?.id!,
               updatedBy: session?.user.name!,
               createdBy: session?.user.name!,
            },
         },
      },
   });

   const transactionData: Prisma.TransactionsCreateManyInput[] = products.map((value, i) => {
      return {
         paymentId: payment.id,
         productsId: value.id!,
         userId: parseInt(session?.user.userId!),
         quantity: value.quantity!,

         status: $Enums.TransactionsStatus.NEW,
         createdBy: session?.user.name!,
         updateBy: session?.user.name!,
      };
   });
   await prisma.transactions.createMany({
      data: transactionData,
   });

   await prisma.cart.updateMany({
      where: {
         id: {
            in: data.cartIds,
         },
      },
      data: {
         isCheckOut: true,
      },
   });

   const transaction = await prisma.transactions.findMany({
      where: {
         paymentId: payment.id,
      },
      include: {
         payment: true,
      },
   });

   const directoryPath = CreateLocationAttachment(8);
   const saveFile = `${directoryPath}/invoice-${payment?.orderId!}.pdf`;

   await ReactPDF.renderToFile(
      Invoice({
         orderId: payment?.orderId!,
         id: payment?.id!,
         amount: payment?.amount!,
         status: payment?.status!,
         createdAt: payment?.createdAt!,
         updatedAt: payment?.updatedAt!,
         user: user!,
         transaction: transaction,
      }),
      saveFile,
   );

   await SendEmail({
      to: user.email!,
      attachment: [
         {
            filename: "invoice.pdf",
            path: saveFile,
         },
      ],
      subject: `invoice payment ${payment.orderId}`,
      html: render(
         Nota({
            orderId: payment?.orderId!,
            id: payment?.id!,
            amount: payment?.amount!,
            status: payment?.status!,
            createdAt: payment?.createdAt!,
            updatedAt: payment?.updatedAt!,
            user: user!,
            transaction: transaction,
         }),
      ),
   });

   return NextResponse.json({
      error: false,
      message: "success to checkout",
      data: paymentData,
   });
}

/**
 * Handles the GET request to retrieve user and cart information.
 * @param request - The incoming request object.
 * @returns A JSON response containing user and cart data.
 */
export async function GET(request: NextRequest) {
   var session = await getServerSession(authOptions);

   var user = await prisma.user.findFirst({
      where: {
         id: parseInt(session?.user.userId!),
      },
      select: {
         id: true,
         name: true,
         email: true,
         address: true,
         city: true,
         postalCode: true,
         phone: true,
         country: true,
      },
   });
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
               priceIDR: true,
               name: true,
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
                  select: {
                     discount: true,

                     productPrice: true,
                  },
               },
            },
         },
      },
   });

   var total = 0;
   var priceProduct = 0;
   var discount;

   for (let i = 0; i < cart.length; i++) {
      priceProduct = Math.ceil(cart[i].product.priceIDR);
      var product: Products = cart[i].product;
      product.quantity = cart[i].buyQuantity;

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

      if (cart[i].product.Discount.length > 0) {
         discount = cart[i].product.Discount;

         for (let j = 0; j < discount.length; j++) {
            if (discount[j].productPrice) {
               priceProduct = discount[j].productPrice!;
            }
         }
      }
      product.price = priceProduct;
      total += product.price * product.quantity;
   }

   var data = {
      user: user,
      cart: cart,
      total: total,
   };

   return NextResponse.json({
      error: true,
      message: null,
      data: data,
   });
}
