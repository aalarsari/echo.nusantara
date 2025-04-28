import { CategoryValidation } from "@/lib/zod-schema/category";
import { z } from "zod";

export async function GetCategory() {
  var response = await fetch(`/api/admin/category`);
  return response;
}

export async function CreateCategory(data: z.infer<typeof CategoryValidation>) {
  var response = await fetch(`/api/admin/category`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}
