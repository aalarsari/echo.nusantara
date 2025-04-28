import { PrismaClient, $Enums, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { createUsers } from "./faker/user";
import { createProduct } from "./faker/product";
import { parseArgs } from "node:util";
import { fakerID_ID as faker } from "@faker-js/faker";
import { ShipmentPriceClass } from "@/types/shipment/shipmetPriceData";
import axios from "axios";
import { CourierResponse } from "@/types/shipment/courier";
import { da } from "date-fns/locale";

var prisma = new PrismaClient();

interface User {
   name: string;
   password: string;
   active: boolean;
   email: string;
   role: $Enums.Role;
   address?: string | null;
   city: string | null | undefined;
   postalCode?: string | null;
   photo: string;
   phone: string;
   lastLogin?: Date | null;
   createdAt: Date | null;
   createdBy: string | null;
   updateAt: Date | null;
   updateBy: string | null;
}
interface Product {
   id?: number;
   name: string;
   descriptions: string;
   slug: string;
   priceIDR: number;
   weight: number;
   stock: number;
   maxOrder: number;
   categoryId: number;
   image1: string;
   image2?: string;
   image3?: string;
   image4?: string;
   image5?: string;
   size?: string | null;
   createdAt?: Date;
   createdBy?: string;
   updateAt?: Date;
   updateBy?: string;
}
interface Couriers extends Prisma.CouriersCreateInput {}

const options = {
   environment: { type: "string" },
} as const;

async function main() {
   const {
      values: { environment },
   } = parseArgs({ options });

   var password = await bcrypt.hash("AdminEcho@2024", 10)!;

   // await prisma.category.createMany({
   //    data: [
   //       {
   //          name: "Dry",
   //       },
   //       {
   //          name: "Ready to serve",
   //       },
   //    ],
   // });

   // await prisma.user.create({
   //    data: {
   //       name: "admin",
   //       email: "admin-echo@mail.com",
   //       role: "ADMIN",
   //       password: password,
   //       phone: "-",
   //       photo: `${process.env.APP_URL!}/main.png`,
   //       active: true,
   //       createdBy: "system",
   //       address: "-",
   //
   //    },
   // });

   const courier = [
      {
         name: "gojek",
         company: "Gojek",
         type: "instant",
         createdBy: "system",
      },
      {
         name: "gojek",
         company: "Gojek",
         type: "same_day",
         createdBy: "system",
      },
      {
         name: "grab",
         company: "Grab",
         type: "instant",
         createdBy: "system",
      },
      {
         name: "grab",
         company: "Grab",
         type: "instant_car",
         createdBy: "system",
      },
      {
         name: "grab",
         company: "Grab",
         type: "same_day",
         createdBy: "system",
      },
      {
         name: "sicepat",
         company: "Sicepat",
         type: "reg",
         createdBy: "system",
      },
      {
         name: "sicepat",
         company: "Sicepat",
         type: "best",
         createdBy: "system",
      },
      {
         name: "sicepat",
         company: "Sicepat",
         type: "sds",
         createdBy: "system",
      },
      {
         name: "sicepat",
         company: "Sicepat",
         type: "gokil",
         createdBy: "system",
      },
      {
         name: "anteraja",
         company: "Anteraja",
         type: "reg",
         createdBy: "system",
      },
      {
         name: "anteraja",
         company: "Anteraja",
         type: "same_day",
         createdBy: "system",
      },
      {
         name: "antaraja",
         company: "Anteraja",
         type: "next_day",
         createdBy: "system",
      },
      {
         name: "jne",
         company: "JNE",
         type: "reg",
         createdBy: "system",
      },
      {
         name: "tiki",
         company: "TIKI",
         type: "reg",
         createdBy: "system",
      },
      {
         name: "lion",
         company: "Lion",
         type: "reg",
         createdBy: "system",
      },
      {
         name: "lion",
         company: "Lion",
         type: "one_pack",
         createdBy: "system",
      },
      {
         name: "lion",
         company: "Lion",
         type: "jago_pack",
         createdBy: "system",
      },
      {
         name: "jnt",
         company: "JNT",
         type: "ez",
         createdBy: "system",
      },
      {
         name: "lalamove",
         company: "Lalamove",
         type: "motorcycle",
         createdBy: "system",
      },
      {
         name: "lalamove",
         company: "Lalamove",
         type: "mpv",
         createdBy: "system",
      },
   ];
   await prisma.couriers.createMany({ data: courier });
}
main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });
