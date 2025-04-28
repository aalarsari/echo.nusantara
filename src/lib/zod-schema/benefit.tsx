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

export const BenefitProduct = zfd.formData({
  title: zfd.text(
    z.string({
      required_error: "Title is required",
    }),
  ),
  description: zfd.text(
    z.string({
      required_error: "description is required",
    }),
  ),
  photo: z.optional(
    z
      .any()
      .refine((file: File) => file !== null && file !== undefined, "Photo must image")
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
  ),
});

export const BenefitProductUpdate = zfd.formData({
  title: zfd.text(z.string().optional().nullable()),
  description: zfd.text(z.string().optional().nullable()),
  photo: z.optional(
    z
      .any()
      .refine((file: File) => file !== null && file !== undefined, "Photo must image")
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
  ),
});
