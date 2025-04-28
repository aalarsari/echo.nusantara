import { Banner } from "@/types/Banner/Banner";
import { Promo } from "@/types/Promo/promo";

export async function CreatePromo(data: Promo) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  var response = await fetch(`/api/admin/promo`, {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function UpdatePromo(data: Promo) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  var response = await fetch(`/api/admin/promo/${data.id}`, {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function PromoData(data: Promo) {
  var response = await fetch(`/api/admin/promo/${data.id}`);
  return response;
}

export async function ListPromo() {
  var response = await fetch(`/api/admin/promo`);
  return response;
}

export async function DeletePromo(data: Promo) {
  var response = await fetch(`/api/admin/promo/${data.id}`, {
    method: "DELETE",
  });
  return response;
}
