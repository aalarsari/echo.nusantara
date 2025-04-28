import { cartValidtion, updateCartValidation } from "@/lib/zod-schema/cart";
import { z } from "zod";

export async function GetListcart() {
   var response = await fetch(`/api/user/cart`, {
      next: { revalidate: 300 },
   });
   return response;
}

export async function GetListCartNavbar() {
   var response = await fetch(`/api/user/cart/navbar`, {
      next: { revalidate: 300 },
   });
   return response;
}

export async function CreateNewcart(data: z.infer<typeof cartValidtion>) {
   var response = await fetch("/api/user/cart", {
      method: "POST",
      headers: {
         "Content-type": "application/json",
      },
      body: JSON.stringify(data),
   });
   return response;
}

export async function Deletecart(data: cart) {
   var response = await fetch(`/api/user/cart/${data.id}`, {
      method: "DELETE",
   });
   return response;
}

export async function UpdateQuantity(data: z.infer<typeof updateCartValidation>, cartid: number) {
   var response = await fetch(`/api/user/cart/${cartid}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
         "Content-type": "application/json",
      },
   });
   return response;
}
