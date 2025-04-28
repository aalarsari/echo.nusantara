import { CreateProductReviewValidation, UpdateReviewProductValidation } from "@/lib/zod-schema/review";
import { z } from "zod";

export async function CreateReview(data: z.infer<typeof CreateProductReviewValidation>) {
  var response = await fetch(`/api/user/review`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}
export async function GetListReview() {
  var response = await fetch(`/api/user/review`);
  return response;
}
export async function GetDetailReview(id: number) {
  var response = await fetch(`api/user/review/${id}`);
  return response;
}

export async function UpdateListReview(data: z.infer<typeof UpdateReviewProductValidation>, id: number) {
  var response = await fetch(`api/user/review/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}
