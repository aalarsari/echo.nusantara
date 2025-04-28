import { ContactValidations } from "@/lib/zod-schema/contact";
import { z } from "zod";

export async function CreateContact(data: z.infer<typeof ContactValidations>) {
  var response = await fetch(`/api/contact`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}
