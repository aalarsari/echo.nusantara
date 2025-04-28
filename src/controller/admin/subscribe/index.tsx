import { SubscriberValidation } from "@/lib/zod-schema/subscriber";
import { z } from "zod";

export async function CreateSubscribeAdmin(
  data: z.infer<typeof SubscriberValidation>,
) {
  var response = await fetch(`/api/admin/subscribe`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}

export async function GetListsubScribeAdmin(page: number, pageSize: number) {
  var response = await fetch(
    `/api/admin/subscribe?page=${page}&pageSize=${pageSize}`,
  );
  return response;
}
