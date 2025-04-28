import { z } from "zod";
import { zfd } from "zod-form-data";

export const DiscountValidation = zfd.formData({
  discount: zfd.numeric(
    z.number({
      required_error: "Discount is required",
      invalid_type_error: "Discount must number",
    }),
  ),
  subject: zfd.text(
    z.string({
      required_error: "Subject is required",
      invalid_type_error: "Subject must string",
    }),
  ),
  startDate: zfd.text(
    z.string({
      required_error: "start date is required",
      invalid_type_error: "start date must string",
    }).date(),
  ),
  endDate: zfd.text(
    z.string({
      required_error: "start date is required",
      invalid_type_error: "start date must string",
    }).date(),
  ),
});
