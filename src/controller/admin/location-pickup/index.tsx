import { CreateLocationPickupValidation } from "@/lib/zod-schema/location-pickup";
import { z } from "zod";

export async function CreateLocationPickup(data: z.infer<typeof CreateLocationPickupValidation>) {
   var response = await fetch("/api/user/location-pickup", {
      body: JSON.stringify(data),
      method: "POST",
   });
   return response;
}
export async function GetListLocationPickup() {
   var response = await fetch("/api/user/location-pickup", {});
   return response;
}
