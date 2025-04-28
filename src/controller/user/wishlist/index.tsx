//wishlist ubah logic

import { WishlistValidation } from "@/lib/zod-schema/wishlist";
import { WishlistProduct } from "@/types/wishlist/wishlist";
import { z } from "zod";

export async function Wishlist(data: z.infer<typeof WishlistValidation>) {
  var response = await fetch(`/api/user/wishlist`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function GetListWishlist() {
  var response = await fetch(`/api/user/wishlist`);
  return response;
}
