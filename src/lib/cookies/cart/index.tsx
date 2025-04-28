"use server";
import prisma from "@/database/prisma";
import { cookies } from "next/headers";
import { totalHarga } from "../../totalCart/totalCart";
import { z } from "zod";
import { cartValidtion } from "../../zod-schema/cart";
import axios from "axios";
import { Session, User } from "next-auth";
import moment from "moment-timezone";

export async function SaveCartLocaly(productId: number, buyQuantity: number) {
   const products: string[] = [];
   const buyQuantities: string[] = [];
   const producstValue: string[] = [];
   const buyQuantitesValue: string[] = [];
   const datas: cart[] = [];
   var quantity = buyQuantity;

   var cookie = cookies().getAll();
   var productCookiesName = "product-0";
   var buyQuantitiesName = "buyQuantites-0";

   for (let i = 0; i < cookie.length; i++) {
      const data = cookie[i];
      var name = data.name;
      var nameSplit = name.split("-");
      if (nameSplit[0].trim() == "product") {
         products.push(name);
         producstValue.push(data.value);
      } else if (nameSplit[0].trim() == "buyQuantites") {
         buyQuantities.push(name);
         buyQuantitesValue.push(data.value);
      }
   }
   for (let i = 0; i < producstValue.length; i++) {
      const e = producstValue[i];
      if (e.trim() === productId.toString().trim()) {
         cookies().delete(products[i]);
         cookies().delete(buyQuantities[i]);

         quantity = parseInt(buyQuantitesValue[i]) + buyQuantity;

         products.splice(i, 1);
         buyQuantities.splice(i, 1);
         producstValue.splice(i, 1);
         buyQuantitesValue.splice(i, 1);
      }
   }

   producstValue.push(productId.toString());
   buyQuantitesValue.push(quantity.toString());

   if (products.length > 0) {
      const data = products[products.length - 1];
      var dataSplit = data.split("-");
      var upData = parseInt(dataSplit[1]) + 1;
      productCookiesName = `${dataSplit[0]}-${upData}`;
      cookies().set(productCookiesName, productId.toString());
   } else {
      cookies().set(productCookiesName, productId.toString());
   }

   if (buyQuantities.length > 0) {
      const data = buyQuantities[buyQuantities.length - 1];
      var dataSplit = data.split("-");
      var upData = parseInt(dataSplit[1]) + 1;
      buyQuantitiesName = `${dataSplit[0]}-${upData}`;
      cookies().set(buyQuantitiesName, quantity.toString());
   } else {
      cookies().set(buyQuantitiesName, quantity.toString());
   }
   for (let i = 0; i < producstValue.length; i++) {
      const data = producstValue[i];
      var product = await prisma.products.findFirst({
         where: {
            id: parseInt(data),
         },
         select: {
            id: true,
            name: true,
            slug: true,
            priceIDR: true,
         },
      });
      var rawData: cart = {
         id: i,
         buyQuantity: parseInt(buyQuantitesValue[i]),
         product: product!,
      };

      datas.push(rawData);
   }
   var cart: CartItem = {
      total: totalHarga(datas)!,
      cart: datas,
      count: datas.length,
   };

   return cart;
}

export async function GetProductLocaly() {
   const producstValue: string[] = [];
   const buyQuantitesValue: string[] = [];
   const datas: cart[] = [];

   var cookie = cookies().getAll();

   for (let i = 0; i < cookie.length; i++) {
      const data = cookie[i];
      var name = data.name;
      var nameSplit = name.split("-")[0];
      if (nameSplit.trim() == "product") {
         producstValue.push(data.value);
      } else if (nameSplit.trim() === "buyQuantites") {
         buyQuantitesValue.push(data.value);
      }
   }
   for (let i = 0; i < producstValue.length; i++) {
      const data = producstValue[i];
      var product = await prisma.products.findFirst({
         where: {
            id: parseInt(data),
         },
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
      });
      var rawData: cart = {
         id: i + 1,
         buyQuantity: parseInt(buyQuantitesValue[i]),
         product: product!,
      };

      datas.push(rawData);
   }
   var cart: CartItem = {
      total: totalHarga(datas)!,
      cart: datas,
      count: datas.length,
   };

   return cart;
}

export async function SendCartLocalyToDatabase(userId: number) {
   const producstValue: string[] = [];
   const buyQuantitesValue: string[] = [];
   const products: string[] = [];
   const buyQuantities: string[] = [];

   var cookie = cookies().getAll();
   for (let i = 0; i < cookie.length; i++) {
      const data = cookie[i];
      var name = data.name;
      var nameSplit = name.split("-")[0];
      if (nameSplit.trim() == "product") {
         products.push(name);
         producstValue.push(data.value);
      } else if (nameSplit.trim() === "buyQuantites") {
         buyQuantities.push(name);
         buyQuantitesValue.push(data.value);
      }
   }
   if (products.length > 0 && buyQuantities.length > 0) {
      for (let i = 0; i < producstValue.length; i++) {
         var productId = producstValue[i];
         var buyQuantity = buyQuantitesValue[i];
         var checkData = await prisma.cart.findFirst({
            where: {
               productsId: parseInt(productId),
               isCheckOut: false,
               isBuyNow: false,
               userId: userId!,
            },
         });

         if (checkData) {
            buyQuantity = (checkData.buyQuantity + parseInt(buyQuantity)).toString();
         }

         if (checkData) {
            var cart = await prisma.cart.update({
               where: {
                  id: checkData.id,
               },
               data: {
                  buyQuantity: parseInt(buyQuantity),
               },
            });
         } else {
            var cart = await prisma.cart.create({
               data: {
                  productsId: parseInt(productId),
                  buyQuantity: parseInt(buyQuantity),
                  userId: userId!,
                  createdAt: moment.tz("Asia/Jakarta").format(),
               },
            });
         }
         cookies().delete(products[i]);
         cookies().delete(buyQuantities[i]);
      }
   }
   return;
}

export async function UpdateBuyQuantity(productId: number, buyQuantity: number) {
   const products: string[] = [];
   const buyQuantities: string[] = [];
   const producstValue: string[] = [];
   const buyQuantitesValue: string[] = [];
   const datas: cart[] = [];
   var quantity = buyQuantity;

   var cookie = cookies().getAll();
   var productCookiesName = "product-0";
   var buyQuantitiesName = "buyQuantites-0";

   for (let i = 0; i < cookie.length; i++) {
      const data = cookie[i];
      var name = data.name;
      var nameSplit = name.split("-");
      if (nameSplit[0].trim() == "product") {
         products.push(name);
         producstValue.push(data.value);
      } else if (nameSplit[0].trim() == "buyQuantites") {
         buyQuantities.push(name);
         buyQuantitesValue.push(data.value);
      }
   }
   for (let i = 0; i < producstValue.length; i++) {
      const e = producstValue[i];
      if (e.trim() === productId.toString().trim()) {
         cookies().delete(products[i]);
         cookies().delete(buyQuantities[i]);

         products.splice(i, 1);
         buyQuantities.splice(i, 1);
         producstValue.splice(i, 1);
         buyQuantitesValue.splice(i, 1);
      }
   }

   producstValue.push(productId.toString());
   buyQuantitesValue.push(quantity.toString());

   if (products.length > 0) {
      const data = products[products.length - 1];
      var dataSplit = data.split("-");
      var upData = parseInt(dataSplit[1]) + 1;
      productCookiesName = `${dataSplit[0]}-${dataSplit}`;
      cookies().set(productCookiesName, productId.toString());
   } else {
      cookies().set(productCookiesName, productId.toString());
   }

   if (buyQuantities.length > 0) {
      const data = buyQuantities[buyQuantities.length - 1];
      var dataSplit = data.split("-");
      var upData = parseInt(dataSplit[1]) + 1;
      buyQuantitiesName = `${dataSplit[0]}-${upData}`;
      cookies().set(buyQuantitiesName, quantity.toString());
   } else {
      cookies().set(buyQuantitiesName, quantity.toString());
   }
   for (let i = 0; i < producstValue.length; i++) {
      const data = producstValue[i];
      var product = await prisma.products.findFirst({
         where: {
            id: parseInt(data),
         },
         select: {
            id: true,
            name: true,
            slug: true,
            priceIDR: true,
         },
      });
      var rawData: cart = {
         id: i,
         buyQuantity: parseInt(buyQuantitesValue[i]),
         product: product!,
      };

      datas.push(rawData);
   }
   var cart: CartItem = {
      total: totalHarga(datas)!,
      cart: datas,
      count: datas.length,
   };

   return cart;
}

export async function DeleteCartLocaly(productId: number) {
   const products: string[] = [];
   const buyQuantities: string[] = [];
   const producstValue: string[] = [];
   const buyQuantitesValue: string[] = [];
   const datas: cart[] = [];

   var cookie = cookies().getAll();

   for (let i = 0; i < cookie.length; i++) {
      const data = cookie[i];
      var name = data.name;
      var nameSplit = name.split("-");
      if (nameSplit[0].trim() == "product") {
         products.push(name);
         producstValue.push(data.value);
      } else if (nameSplit[0].trim() == "buyQuantites") {
         buyQuantities.push(name);
         buyQuantitesValue.push(data.value);
      }
   }
   for (let i = 0; i < producstValue.length; i++) {
      const e = producstValue[i];
      if (e.trim() === productId.toString().trim()) {
         cookies().delete(products[i]);
         cookies().delete(buyQuantities[i]);

         products.splice(i, 1);
         buyQuantities.splice(i, 1);
         producstValue.splice(i, 1);
         buyQuantitesValue.splice(i, 1);
      }
   }
   for (let i = 0; i < producstValue.length; i++) {
      const data = producstValue[i];
      var product = await prisma.products.findFirst({
         where: {
            id: parseInt(data),
         },
         select: {
            id: true,
            name: true,
            slug: true,
            priceIDR: true,
         },
      });
      var rawData: cart = {
         id: i,
         buyQuantity: parseInt(buyQuantitesValue[i]),
         product: product!,
      };

      datas.push(rawData);
   }
   var cart: CartItem = {
      total: totalHarga(datas)!,
      cart: datas,
      count: datas.length,
   };

   return cart;
}
