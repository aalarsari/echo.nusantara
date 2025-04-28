import { z } from "zod";
import { zfd } from "zod-form-data";

export const RefundValidation = zfd.formData(
  z.object({
    orderId: zfd.text(
      z.string({
        required_error: "Subject is required",
        invalid_type_error: "Subject must string",
      }),
    ),
    reason: zfd.text(z.string().optional().nullable()),
  }),
);
