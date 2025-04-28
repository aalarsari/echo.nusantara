import { z } from "zod";
import { zfd } from "zod-form-data";

export const cartValidtion = zfd.formData({
  productId: zfd.numeric(
    z.number({
      required_error: "Product is required",
      invalid_type_error: "ProductId must number",
    }),
  ),
  quantity: zfd.numeric(
    z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must number",
      })
      .min(1, {
        message: "Must be 1 or greater for the quantity",
      }),
  ),
});

export const updateCartValidation = zfd.formData({
  quantity: zfd.numeric(
    z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must number",
      })
      .min(1, {
        message: "Must be 1 or greater for the quantity",
      }),
  ),
});
