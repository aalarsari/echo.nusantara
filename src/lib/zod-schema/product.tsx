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

/**
 * ProductValidation schema using Zod and zod-form-data (zfd) to validate product form data.
 *
 * This schema validates the following fields:
 * - `name`: Required string with an error message if not provided.
 * - `descriptions`: Required string with an error message if not provided.
 * - `subDescriptions`: Optional nullable string.
 * - `priceIDR`: Required numeric value with error messages for required and invalid type.
 * - `weight`: Required numeric value with error messages for required and invalid type.
 * - `stock`: Required numeric value with error messages for required and invalid type.
 * - `maxOrder`: Required numeric value with error messages for required and invalid type.
 * - `categoryId`: Required numeric value with error messages for required and invalid type.
 * - `size`: Optional nullable string.
 * - `recommendation`: Optional nullable boolean.
 * - `image1`: Required file with validations for non-null, size limit (5MB), and file type (.jpeg, .jpg, .png).
 * - `image2`: Optional file with validations for non-null, size limit (5MB), and file type (.jpeg, .jpg, .png).
 * - `image3`: Optional file with validations for non-null, size limit (5MB), and file type (.jpeg, .jpg, .png).
 * - `image4`: Optional file with validations for non-null, size limit (5MB), and file type (.jpeg, .jpg, .png).
 * - `image5`: Optional file with validations for non-null, size limit (5MB), and file type (.jpeg, .jpg, .png).
 *
 * The schema uses custom validation functions to check file size and type.
 */
export const ProductValidation = zfd.formData(
  z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    descriptions: z.string({
      required_error: "Descriptions is required",
    }),
    subDescriptions: z.string().optional().nullable(),
    priceIDR: zfd.numeric(
      z.number({
        required_error: "price is required",
        invalid_type_error: "price must number",
      })
    ),
    weight: zfd.numeric(
      z.number({
        required_error: "Weight is required",
        invalid_type_error: "Weight must number",
      })
    ),
    stock: zfd.numeric(
      z.number({
        required_error: "Stock is required",
        invalid_type_error: "Stock must number",
      })
    ),
    maxOrder: zfd.numeric(
      z.number({
        required_error: "MaxOrder is required",
        invalid_type_error: "MaxOrder must number",
      })
    ),
    categoryId: zfd.numeric(
      z.number({
        required_error: "Category is required",
        invalid_type_error: "CategoryId must number",
      })
    ),
    size: zfd.text(z.string().optional().nullable()),
    recommendation: z.boolean().optional().nullable(),
    isBestSeller: z.boolean().nullable().default(false),
    image1: z
      .any()
      .refine((file) => file !== null && file !== undefined, "Image minimal 1")
      .refine((file) => {
        return file && typeof file.size === "number" && file.size <= MAX_FILE_SIZE;
      }, "Max size is 5MB.")
      .refine((file) => file && checkFileType(file), "Only .jpeg, .jpg, png formats are supported."),
    image2: z.optional(
      z
        .any()
        .refine((file: File) => file !== null && file !== undefined, "Image2 must image")
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
        }, "Only .jpeg, .jpg, png formats are supported.")
    ),

    image3: z.optional(
      z
        .any()
        .refine((file: File) => file !== null && file !== undefined, "Image3 must image")
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
        }, "Only .jpeg, .jpg, png formats are supported.")
    ),
    image4: z.optional(
      z
        .any()
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && typeof file.size === "number" && file.size <= MAX_FILE_SIZE;
          }
        }, "Max size is 5MB.")
        .refine((file: File) => file !== null && file !== undefined, "Image4 must image")
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && checkFileType(file);
          }
        }, "Only .jpeg, .jpg, png formats are supported.")
    ),
    image5: z.optional(
      z
        .any()
        .refine((file: File) => file !== null && file !== undefined, "Image5 must image")
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
        }, "Only .jpeg, .jpg, png formats are supported.")
    ),
  })
);

export const ProductUpadateValidation = zfd.formData(
  z.object({
    name: z.string().optional().nullable(),
    descriptions: z.string().optional().nullable(),
    subDescriptions: z.string().optional().nullable(),
    isBestSeller: z.boolean().optional().nullable(),
    recommendation: z.boolean().optional().nullable(),
    priceIDR: zfd.numeric(
      z
        .number({
          invalid_type_error: "price must number",
        })
        .optional()
        .nullable()
    ),
    weight: zfd.numeric(
      z
        .number({
          invalid_type_error: "Weight must number",
        })
        .optional()
        .nullable()
    ),
    stock: zfd.numeric(
      z
        .number({
          invalid_type_error: "Stock must number",
        })
        .optional()
        .nullable()
    ),
    maxOrder: zfd.numeric(
      z
        .number({
          invalid_type_error: "MaxOrder must number",
        })
        .optional()
        .nullable()
    ),
    categoryId: zfd.numeric(
      z
        .number({
          invalid_type_error: "CategoryId must number",
        })
        .optional()
        .nullable()
    ),
    size: zfd.text(z.string().optional().nullable()),
    image1: z.optional(z.any()),
    image2: z.optional(z.any()),
    image3: z.optional(z.any()),
    image4: z.optional(z.any()),
    image5: z.optional(z.any()),
  })
);
