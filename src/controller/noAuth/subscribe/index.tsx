import { SubscriberValidation } from "@/lib/zod-schema/subscriber";
import { z } from "zod";

export async function postSubscirbe(
  data: z.infer<typeof SubscriberValidation>,
) {
  var response = await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}
