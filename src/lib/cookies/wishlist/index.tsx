"use server";

import prisma from "@/database/prisma";
import { WishlistValidation } from "@/lib/zod-schema/wishlist";
import { WishlistItem, WishlistProduct } from "@/types/wishlist/wishlist";
import { cookies } from "next/headers";
import { z } from "zod";

export async function WishlistCookies(productId: number) {

  const products: string[] = [];
  const producstValue: string[] = [];

  var cookie = cookies().getAll();
  const datas: WishlistItem[] = [];

  var productName = "wishlist-0";

  for (let i = 0; i < cookie.length; i++) {
    const e = cookie[i];
    var cookieName = e.name;
    var cookieValue = e.value;
    var nameSplit = cookieName.split("-")[0];
    if (nameSplit == "wishlist") {
      products.push(cookieName);
      producstValue.push(cookieValue);
    }
  }
  var isDelete = false;
  for (let i = 0; i < producstValue.length; i++) {
    const e = producstValue[i];
    if (e.trim() === productId.toString().trim()) {
      cookies().delete(products[i]);
      isDelete = true;
      products.splice(i, 1);
      producstValue.splice(i, 1);
    }
  }

  if (products.length > 0) {
    const data = products[products.length - 1];
    var dataSplit = data.split("-");
    var upData = parseInt(dataSplit[1]) + 1;
    productName = `${dataSplit[0]}-${upData}`;
    if (!isDelete) {
      cookies().set(productName, productId.toString());
    }
  } else {
    if (!isDelete) {
      cookies().set(productName, productId.toString());
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
    var rawData: WishlistItem = {
      product: product!,
    };

    datas.push(rawData);
  }

  return datas;
}

export async function GetWishlistCookies() {
  const products: string[] = [];
  const producstValue: string[] = [];

  var cookie = cookies().getAll();
  const datas: WishlistItem[] = [];

  for (let i = 0; i < cookie.length; i++) {
    const e = cookie[i];
    var cookieName = e.name;
    var cookieValue = e.value;
    var nameSplit = cookieName.split("-")[0];
    if (nameSplit == "wishlist") {
      products.push(cookieName);
      producstValue.push(cookieValue);
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
      },
    });
    var rawData: WishlistItem = {
      product: product!,
    };

    datas.push(rawData);
  }

  return datas;
}

export async function SendCookieWishlist() {
  const products: string[] = [];
  const producstValue: string[] = [];

  var cookie = cookies().getAll();
  const datas: WishlistProduct[] = [];

  for (let i = 0; i < cookie.length; i++) {
    const e = cookie[i];
    var cookieName = e.name;
    var cookieValue = e.value;
    var nameSplit = cookieName.split("-")[0];
    if (nameSplit == "wishlist") {
      products.push(cookieName);
      producstValue.push(cookieValue);
    }
  }
  var wishlist: z.infer<typeof WishlistValidation>;
  if (products.length > 0) {
    for (let i = 0; i < producstValue.length; i++) {
      const productId = producstValue[i];
      wishlist = {
        productId: parseInt(productId),
      };
      var res = await fetch(`${process.env.APP_URL}/api/user/wishlist`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(wishlist),
      });
      if (res.ok) {
        cookies().delete(products[i]);
      } else {
        break;
      }
    }
  }
}
