import { CreateShipmentType } from "@/lib/zod-schema/shipment";

export async function GetPriceCouriers(data: CreateShipmentType) {
   var response = await fetch(`/api/user/shipment`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
         "Content-type": "application/json",
      },
   });
   return response;
}
