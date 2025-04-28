import { ContactValidations } from "@/lib/zod-schema/contact";
import { z } from "zod";

export async function CreateContactAdmin(
  data: z.infer<typeof ContactValidations>,
) {
  var response = await fetch(`/api/admin/contact`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}

export async function GetListContactAdmin(page: number, pageSize: number) {
  var response = await fetch(
    `/api/admin/contact?page=${page}&pageSize=${pageSize}`,
  );
  return response;
}

export async function GetDetailContactAdmin(id: number) {
  var response = await fetch(`/api/admin/contact/${id}`);
  return response;
}
