import { z } from "zod";
import { zfd } from "zod-form-data";

export const WishlistValidation = zfd.formData(
  z.object({
    productId: zfd.numeric(
      z.number({
        required_error: "Product is required",
        invalid_type_error: "ProductId must number",
      }),
    ),
  }),
);
