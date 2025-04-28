import { UserUpdateValidation } from "@/lib/zod-schema/user";
import { z } from "zod";

export async function ListUser(
  page: number,
  pageSize: number,
  search: string,
  orderBy: string,
  nameOrderBy: string,
) {
  var response = await fetch(
    `/api/admin/user?page=${page}&pageSize=${pageSize}&search=${search}&orderBy=${orderBy}&nameOrderBy=${nameOrderBy}`,
  );
  return response;
}

export async function CreateUser(data: User) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  var response = await fetch(`/api/admin/user`, {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function UpdateUser(
  data: z.infer<typeof UserUpdateValidation>,
  id: number,
) {
  var response = await fetch(`/api/admin/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
}

export async function User(id: number) {
  var response = await fetch(`/api/admin/user/${id}`, {
    method: "GET",
  });
  return response;
}
