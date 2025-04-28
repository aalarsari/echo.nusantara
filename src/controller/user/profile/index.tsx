import {
  photoProfileUpdate,
  profileUpdate,
  profileUpdatePassword,
} from "@/lib/zod-schema/profile";
import { z } from "zod";

export async function UpdateProfile(data: z.infer<typeof profileUpdate>) {
  var response = await fetch(`/api/user/profile/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
}

export async function UpdateChangeProfilePicture(
  data: z.infer<typeof photoProfileUpdate>,
) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key as keyof z.infer<typeof photoProfileUpdate>]);
  });
  var response = await fetch(`/api/user/profile/photo`, {
    method: "PUT",
    body: formData,
  });
  return response;
}

export async function ChangPassword(
  data: z.infer<typeof profileUpdatePassword>,
) {
  var response = await fetch(`/api/user/profile/change-password`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
}

export async function Profile() {
  const response = await fetch(`/api/user/profile/`);
  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }
  return response.json();
}
