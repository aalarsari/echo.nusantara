import { SendCartLocalyToDatabase } from "@/lib/cookies/cart";
import { SendCookieWishlist } from "@/lib/cookies/wishlist";
import { AnonymusRegisterValidation } from "@/lib/zod-schema/user";
import { signIn } from "next-auth/react";
import { z } from "zod";

export async function RegisterAnonymus(data: z.infer<typeof AnonymusRegisterValidation>) {
   var response = await fetch("/api/anonymus-user/register", {
      method: "POST",
      headers: {
         "Content-type": "application/json",
      },
      body: JSON.stringify(data),
   });
   if (response.ok) {
      const result = await response.json();
      const data = result.data;
      await signIn("credentials", {
         username: data.email,
         password: data.password,
         redirect: false,
      });
      return data;
   }

   return null;
}

export async function BuyNowAnonymus(data: z.infer<typeof AnonymusRegisterValidation>) {
   var response = await fetch("/api/anonymus-user", {
      method: "POST",
      headers: {
         "Content-type": "application/json",
      },
      body: JSON.stringify(data),
   });
   return response;
}
