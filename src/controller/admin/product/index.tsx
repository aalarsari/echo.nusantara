import { DiscountValidation } from "@/lib/zod-schema/discount";
import { ProductUpadateValidation } from "@/lib/zod-schema/product";
import { z } from "zod";

export async function AddProduct(data: Products) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  var response = await fetch("/api/admin/product", {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function UpdateProduct(
  data: z.infer<typeof ProductUpadateValidation>,
  slug: string,
) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key as keyof typeof data]);
  });
  var response = await fetch(`/api/admin/product/${slug}`, {
    method: "PUT",
    body: formData,
  });
  return response;
}

export async function ListProductAdmin(
  page: number,
  pageSize: number,
  search: string,
  orderBy: string,
  nameOrderBy: string,
) {
  var response = await fetch(
    `/api/admin/product/?page=${page}&pageSize=${pageSize}&search=${search}&orderBy=${orderBy}&nameOrderBy=${nameOrderBy}`,
    {
      method: "GET",
    },
  );
  return response;
}

export async function DetailShopAdmin(slug: string) {
  var response = await fetch(`/api/admin/product/${slug}`, {
    method: "GET",
  });
  return response;
}

export async function GetList(slug: string) {
  var resposne = await fetch(`/api/admin/product/${slug}/review`, {
    method: "GET",
  });
  return resposne;
}

export async function DeleteProduct(slug: string) {
  var response = await fetch(`/api/admin/product/${slug}`, {
    method: "DELETE",
  });
  return response;
}

export async function AddDiscountProduct(
  data: z.infer<typeof DiscountValidation>,
  slug: string,
) {
  var response = await fetch(`/api/admin/product/${slug}/discount`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}

export async function DeleteDiscountProduct(id: number, slug: string) {
  var response = await fetch(`/api/admin/product/${slug}/discount/${id}`, {
    method: "DELETE",
  });
  return response;
}
