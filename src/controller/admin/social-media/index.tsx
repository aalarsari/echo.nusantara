import { SocialMediaUpdateValidation, SocialMediaValidation } from "@/lib/zod-schema/socialMedia";
import { z } from "zod";

export async function CreateSocailMedia(data: z.infer<typeof SocialMediaValidation>) {
   var formData = new FormData();

   Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof z.infer<typeof SocialMediaValidation>]);
   });

   var response = await fetch(`/api/admin/social-media`, {
      method: "POST",
      body: formData,
   });
   return response;
}

export async function UpdateSocailMedia(data: z.infer<typeof SocialMediaUpdateValidation>, id: number) {
   var formData = new FormData();

   Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof z.infer<typeof SocialMediaUpdateValidation>]);
   });

   var response = await fetch(`/api/admin/social-media/${id}`, {
      method: "PATCH",
      body: formData,
   });
   return response;
}

export async function UpdateStatusSocialMedia(id: number) {
   var response = await fetch(`/api/admin/social-media/${id}`, {
      method: "PUT",
   });
   return response;
}

export async function DetailSocialMedia(id: number) {
   var response = await fetch(`/api/admin/social-media/${id}`);
   return response;
}

export async function GetListSocialMedia() {
   var response = await fetch(`/api/admin/social-media`);
   return response;
}
