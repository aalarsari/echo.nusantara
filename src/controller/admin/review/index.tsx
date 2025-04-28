import { CreateProductReviewValidation, CreateReviewValidation, UpdateReviewValidation } from "@/lib/zod-schema/review";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export async function CreateReviewAdmin(data: z.infer<typeof CreateReviewValidation>) {
  var formData = new FormData();


  Object.keys(data).forEach((key) => {
    formData.append(key, data[key as keyof typeof data]);
  });
  var response = await fetch(`/api/admin/review`, {
    method: "POST",
    body: formData,
  });
  return response;
}
export async function GetListReview(orderDirection?: Prisma.SortOrder) {
  var link = `/api/admin/review`;
  if (orderDirection) {
    link = link + `?orderDirection=${orderDirection}`;
  }
  var response = await fetch(link);
  return response;
}
export async function GetDetailReview(id: number) {
  var response = await fetch(`/api/admin/review/${id}`);
  return response;
}

export async function DeleteReview(id: number) {
  var response = await fetch(`/api/admin/review/${id}`, { method: "DELETE" });
  return response;
}

export async function UpdateListReview(data: z.infer<typeof UpdateReviewValidation>, id: number) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key as keyof typeof data]);
  });
  var response = await fetch(`/api/admin/review/${id}`, {
    method: "PUT",
    body: formData,

    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}
