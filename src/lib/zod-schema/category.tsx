import { z } from "zod";
import { zfd } from "zod-form-data";

export const CategoryValidation = zfd.formData(
  z.object({
    name: zfd.text(
      z.string({
        required_error: "name is required",
      }),
    ),
    description: zfd.text(
      z.string({
        required_error: "description is required",
      }),
    ),
  }),
);
