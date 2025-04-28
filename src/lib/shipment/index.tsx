import prisma from "@/database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../nextAuth/auth";
import { Couriers as PrismaCouries } from "@prisma/client";
import axios from "axios";
import moment from "moment-timezone";
import path from "path";
import fs from "fs";

// ini biar dapat pricing
const flagNew = { flag: "wx" };

export async function CreateDraftShipment(origin: OriginShipmet, destination: User, courier: PrismaCouries, items: Products[]) {
   var body: Shipment = {
      shipper_contact_name: "echo-nusantara",
      shipper_contact_phone: "+6282137476157",
      shipper_contact_email: "aal@arsari.co.id",
      shipper_organization: "echo-nusantara",
      origin_contact_name: "echo-nusantara",
      origin_contact_phone: "+6282137476157",
      origin_address: origin.address!,
      origin_note: origin.note,
      origin_postal_code: origin.postalCode,
      origin_coordinate: origin.coordinate,
      origin_collection_method: origin.collectionMethod,
      destination_contact_name: destination.name,
      destination_contact_phone: destination.phone!,
      destination_contact_email: destination.email!,
      destination_address: `${destination.address}, ${destination.city}`,
      destination_coordinate: {
         latitude: destination.latitude!,
         longitude: destination.longitude!,
      },
      destination_postal_code: parseInt(destination.postalCode!),
      courier_company: courier.name.toLowerCase(),
      courier_type: courier.type.toLowerCase(),
      delivery_type: courier.deliveryType,
      items: items,
   };

   var header = {
      authorization: process.env.BITSHIP_TOKEN_API!,
      "content-type": "application/json",
   };

   try {
      var res = await axios.request({
         url: `${process.env.BITSHIP_URL}v1/draft_orders`,
         method: "POST",
         headers: header,
         data: body,
      });

      if (res) {
         var data: OrderResponse = await res.data;

         return data!;
      }
   } catch (error) {
      {
         if (axios.isAxiosError(error)) {
            const logDirectory = path.join("./logs");
            const filePath = path.join(logDirectory, "error-log.log");
            // Create the directory if it doesn't exist
            if (!fs.existsSync(logDirectory)) {
               fs.mkdirSync(logDirectory, { recursive: true });
            }
            // Axios-specific error handling
            console.error("Axios error:", error.message);
            console.error("Error response data:", error.response?.data);
            if (!fs.existsSync(filePath)) {
               const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
               fs.writeFileSync(filePath, message, flagNew);
            } else {
               const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
               fs.appendFileSync(filePath, message);
            }
            throw new Error(error.message);
         } else {
            const logDirectory = path.join("./logs");
            const filePath = path.join(logDirectory, "error-log.log");
            // Create the directory if it doesn't exist
            if (!fs.existsSync(logDirectory)) {
               fs.mkdirSync(logDirectory, { recursive: true });
            }
            // Axios-specific error handling
            if (!fs.existsSync(filePath)) {
               const message = `[${moment.tz().format()}] ${error} \n`;
               fs.writeFileSync(filePath, message, flagNew);
            } else {
               const message = `[${moment.tz().format()}] ${error} \n`;

               fs.appendFileSync(filePath, message);
            }
         }
      }
   }
}
//ketika pembayaran sudah selesai
export async function ConfirmDraftShipment(shipmentCode: string) {
   var session = await getServerSession(authOptions);

   var header = {
      authorization: process.env.BITSHIP_TOKEN_API!,
      "content-type": "application/json",
   };
   try {
      var res = await axios.request({
         url: `${process.env.BITSHIP_URL}v1/draft_orders/${shipmentCode}/confirm`,
         headers: header,
         method: "POST",
      });
      if (res) {
         var data: OrderResponse = await res.data;

         var checkShipment = await prisma.shipment.findFirst({
            where: {
               shipmentCode: shipmentCode,
            },
         });

         if (checkShipment) {
            var shipment = await prisma.shipment.update({
               where: {
                  id: checkShipment.id,
               },
               data: {
                  shipmentCode: data.id,
                  price: data.price,
                  status: data.status,
                  trackingId: data.courier.tracking_id,
                  updatedBy: session?.user.name!,
                  updatedAt: moment.tz().format(),
               },
            });
         }
      }
      return shipment!;
   } catch (error) {
      if (axios.isAxiosError(error)) {
         const logDirectory = path.join("./logs");
         const filePath = path.join(logDirectory, "error-log.log");
         // Create the directory if it doesn't exist
         if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
         }
         // Axios-specific error handling
         console.error("Axios error:", error.message);
         console.error("Error response data:", error.response?.data);
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
            fs.appendFileSync(filePath, message);
         }
         throw new Error(error.message);
      } else {
         const logDirectory = path.join("./logs");
         const filePath = path.join(logDirectory, "error-log.log");
         // Create the directory if it doesn't exist
         if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
         }
         // Axios-specific error handling
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${error} \n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}] ${error} \n`;

            fs.appendFileSync(filePath, message);
         }
      }
   }
}

export async function UpdateStatusShipment(shipmentCode: string) {
   var session = await getServerSession(authOptions);

   var header = {
      authorization: process.env.BITSHIP_TOKEN_API!,
      "content-type": "application/json",
   };
   try {
      var res = await axios.request({
         url: `${process.env.BITSHIP_URL}v1/orders/${shipmentCode}`,
         headers: header,
         method: "GET",
      });
      if (res) {
         var data: OrderResponse = await res.data;
         var shipment = await prisma.shipment.findFirst({
            where: {
               shipmentCode: data.id,
            },
         });
         var shipmentData = await prisma.shipment.update({
            where: {
               id: shipment?.id,
            },
            data: {
               status: data.status,
               updatedBy: session?.user.name!,
               updatedAt: moment.tz().format(),
            },
         });
         return shipmentData;
      } else {
         return null;
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         const logDirectory = path.join("./logs");
         const filePath = path.join(logDirectory, "error-log.log");
         // Create the directory if it doesn't exist
         if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
         }
         // Axios-specific error handling
         console.error("Axios error:", error.message);
         console.error("Error response data:", error.response?.data);
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
            fs.appendFileSync(filePath, message);
         }
         throw new Error(error.message);
      } else {
         const logDirectory = path.join("./logs");
         const filePath = path.join(logDirectory, "error-log.log");
         // Create the directory if it doesn't exist
         if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
         }
         // Axios-specific error handling
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${error} \n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}] ${error} \n`;

            fs.appendFileSync(filePath, message);
         }
      }
   }
}

export async function TrackingData(trackingId: string) {
   var header = {
      authorization: process.env.BITSHIP_TOKEN_API!,
      "content-type": "application/json",
   };
   try {
      var res = await axios.request({
         url: `${process.env.BITSHIP_URL}v1/trackings/${trackingId}`,
         headers: header,
      });
      if (res) {
         var data: Tracking = await res.data;
         // check tracking
         return data;
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         const logDirectory = path.join("./logs");
         const filePath = path.join(logDirectory, "error-log.log");
         // Create the directory if it doesn't exist
         if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
         }
         // Axios-specific error handling
         console.error("Axios error:", error.message);
         console.error("Error response data:", error.response?.data);
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
            fs.appendFileSync(filePath, message);
         }
         throw new Error(error.message);
      } else {
         const logDirectory = path.join("./logs");
         const filePath = path.join(logDirectory, "error-log.log");
         // Create the directory if it doesn't exist
         if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
         }
         // Axios-specific error handling
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${error} \n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}] ${error} \n`;

            fs.appendFileSync(filePath, message);
         }
      }
   }
}

// get data location pickup

export async function GetLocationPickup() {
   try {
      var header = {
         authorization: process.env.BITSHIP_TOKEN_API!,
         "content-type": "application/json",
      };
      var res = await fetch(`${process.env.BITSHIP_URL}v1/locations`, {
         headers: header,
      });
      var data: Address[] = (await res.json()).locations;

      if (res.ok) {
         return data[0];
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         const logDirectory = path.join("./logs");
         const filePath = path.join(logDirectory, "error-log.log");
         // Create the directory if it doesn't exist
         if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
         }
         // Axios-specific error handling
         console.error("Axios error:", error.message);
         console.error("Error response data:", error.response?.data);
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
            fs.appendFileSync(filePath, message);
         }
         throw new Error(error.message);
      } else {
         const logDirectory = path.join("./logs");
         const filePath = path.join(logDirectory, "error-log.log");
         // Create the directory if it doesn't exist
         if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
         }
         // Axios-specific error handling
         if (!fs.existsSync(filePath)) {
            const message = `[${moment.tz().format()}] ${error} \n`;
            fs.writeFileSync(filePath, message, flagNew);
         } else {
            const message = `[${moment.tz().format()}] ${error} \n`;

            fs.appendFileSync(filePath, message);
         }
      }
   }
}
