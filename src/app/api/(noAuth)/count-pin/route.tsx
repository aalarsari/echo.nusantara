//count pin disini karena butuh serversession untuk redux

import prisma from "@/database/prisma";
import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  var session = await getServerSession(authOptions);
  var userId = parseInt(session?.user.userId!);
  if (session) {
    var cartCount = await prisma.cart.count({
      where: {
        isCheckOut: false,
        isBuyNow:false,
        userId: userId,
      },
    });

    var wishlistCount = await prisma.wishlistProduct.count({
      where: {
        userId: userId,
      },
    });
    var data = {
      cart: cartCount,
      wishlist: wishlistCount,
    };
  } else {
    const cart: string[] = [];
    const wishlist: string[] = [];

    var cookie = cookies().getAll();

    for (let i = 0; i < cookie.length; i++) {
      const data = cookie[i];
      var name = data.name;
      var nameSplit = name.split("-");
      if (nameSplit[0].trim() == "product") {
        cart.push(name);
      } else if (nameSplit[0].trim() == "wishlist") {
        wishlist.push(name);
      }
    }
    var data = {
      cart: cart.length,
      wishlist: wishlist.length,
    };
  }

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}
