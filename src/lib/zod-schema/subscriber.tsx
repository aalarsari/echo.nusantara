import { z } from "zod";
import { zfd } from "zod-form-data";

export const SubscriberValidation = zfd.formData(
  z.object({
    email: zfd.text(
      z.string({
        required_error: " Email is required",
      }),
    ),
  }),
);
