import { z } from "zod";
import { zfd } from "zod-form-data";
const MAX_FILE_SIZE = 5000000;

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") return true;
  }
  return false;
}

export const CreateProductReviewValidation = zfd.formData({
  review: zfd.text(
    z.string({
      required_error: "Review is required",
    }),
  ),
  rate: zfd.numeric(
    z
      .number({
        required_error: "Rate is required",
        invalid_type_error: "Rate must number",
      })
      .min(0, {
        message: "minimal massage is 0",
      })
      .max(5, {
        message: "Maximal message is 5",
      }),
  ),
  productId: zfd.numeric(
    z.number({
      required_error: "ProductId is required",
      invalid_type_error: "ProductId must number",
    }),
  ),
});

export const CreateReviewValidation = zfd.formData({
  title: zfd.text(
    z.string({
      required_error: "Title is required",
    }),
  ),
  name: zfd.text(
    z.string({
      required_error: "name is required",
    }),
  ),
  subtitle: zfd.text(
    z
      .string({
        required_error: "Subtitle is required",
      })
      .optional()
      .nullable(),
  ),
  photo: z
    .any()
    .refine((file: File) => {
      return file !== null && file !== undefined;
    }, "photo must image")
    .refine((file) => {
      if (file === "undefined") {
        return true;
      } else {
        return file && typeof file.size === "number" && file.size <= MAX_FILE_SIZE;
      }
    }, "Max size is 5MB.")
    .refine((file) => {
      if (file === "undefined") {
        return true;
      } else {
        return file && checkFileType(file);
      }
    }, "Only .jpeg, .jpg, png formats are supported."),
  review: zfd.text(
    z.string({
      required_error: "Review is required",
    }),
  ),
  rating: zfd.numeric(
    z
      .number({
        required_error: "Rate is required",
        invalid_type_error: "Rate must number",
      })
      .min(0, {
        message: "minimal massage is 0",
      })
      .max(5, {
        message: "Maximal message is 5",
      }),
  ),
});

export const UpdateReviewProductValidation = zfd.formData({
  review: zfd.text(z.string().optional().nullable()),
  rate: zfd.numeric(
    z
      .number()
      .min(0, {
        message: "minimal massage is 0",
      })
      .max(5, {
        message: "Maximal message is 5",
      })
      .optional()
      .nullable(),
  ),
});

export const UpdateReviewValidation = zfd.formData({
  title: zfd
    .text(
      z.string({
        required_error: "Title is required",
      }),
    )
    .optional()
    .nullable(),
  name: zfd
    .text(
      z.string({
        required_error: "name is required",
      }),
    )
    .optional()
    .nullable(),
  subtitle: zfd
    .text(
      z.string({
        required_error: "Subtitle is required",
      }),
    )
    .optional()
    .nullable(),
  review: zfd.text(z.string().optional().nullable()),
  rate: zfd.numeric(
    z
      .number()
      .min(0, {
        message: "minimal massage is 0",
      })
      .max(5, {
        message: "Maximal message is 5",
      })
      .optional()
      .nullable(),
  ),
  photo: z.optional(z.any()),
});
