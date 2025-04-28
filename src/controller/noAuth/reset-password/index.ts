import { prepareResetPassword } from "@/lib/zod-schema/reset-password";
import { z } from "zod";

export async function ChangePassword(
  data: z.infer<typeof prepareResetPassword>,
) {
  var response = await fetch("/api/change-password", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function ConfirmChangepassword(
  data: z.infer<typeof prepareResetPassword>,
  token: string,
) {
  var response = await fetch(`/api/change-password/${token}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}
