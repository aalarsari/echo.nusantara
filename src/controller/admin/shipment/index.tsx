import { ShipmentUpdateValidation } from "@/lib/zod-schema/shipment";
import { z } from "zod";

export async function ListShipment(
  page: number,
  pageSize: number,
  find: string,
) {
  var res = await fetch(
    `/api/admin/shipment?page=${page}&pageSize=${pageSize}&find=${find}`,
  );
  return res;
}

export async function GetDetailShipment(shipmentCode: string) {
  var res = await fetch(`/api/admin/shipment/${shipmentCode}`);
  return res;
}

export async function UpdateShipment(
  shipmentCode: string,
  data: z.infer<typeof ShipmentUpdateValidation>,
) {
  var res = await fetch(`/api/admin/shipment/${shipmentCode}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res;
}
