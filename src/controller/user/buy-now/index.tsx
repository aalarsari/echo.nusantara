import { cartValidtion } from "@/lib/zod-schema/cart";
import { z } from "zod";

export async function getBuyNowData(cartId: number) {
  var response = await fetch(`/api/user/buy-now?cartId=${cartId}`);
  return response;
}

export async function BuyNow(data: z.infer<typeof cartValidtion>) {
  var response = await fetch("/api/user/buy-now", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}
