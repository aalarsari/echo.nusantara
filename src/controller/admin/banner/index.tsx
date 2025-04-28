import { UpdateBannerValidation } from "@/lib/zod-schema/banner";
import { Banner } from "@/types/Banner/Banner";
import { z } from "zod";

export async function CreateBanner(data: Banner) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  var response = await fetch(`/api/admin/banner`, {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function UpdateBanner(data: Banner) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  var response = await fetch(`/api/admin/banner/${data.id}`, {
    method: "PUT",
    body: formData,
  });
  return response;
}

export async function UpdateDetailBanner(
  data: z.infer<typeof UpdateBannerValidation>,
  id: number,
) {
  var response = await fetch(`/api/admin/banner/${id}/detail`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
}

export async function BannerData(data: string) {
  var response = await fetch(`/api/admin/banner/${data}`);
  return response;
}

export async function ListBanner() {
  var response = await fetch(`/api/admin/banner`);
  return response;
}

export async function DeleteBanner(data: Banner) {
  var response = await fetch(`/api/admin/banner/${data.id}`, {
    method: "DELETE",
  });
  return response;
}
