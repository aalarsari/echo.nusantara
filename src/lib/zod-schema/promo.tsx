import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 5000000;
function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (
      fileType === "jpg" ||
      fileType === "jpeg" ||
      fileType === "png" ||
      fileType === "svg"
    )
      return true;
  }
  return false;
}

export const PromoValidation = zfd.formData(
  z.object({
    title: zfd.text(
      z.string({
        required_error: "Title is required",
      }),
    ),
    subtitle: zfd.text(
      z.string({
        required_error: "Subtitle is required",
      }),
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
          return (
            file && typeof file.size === "number" && file.size <= MAX_FILE_SIZE
          );
        }
      }, "Max size is 5MB.")
      .refine((file) => {
        if (file === "undefined") {
          return true;
        } else {
          return file && checkFileType(file);
        }
      }, "Only .jpeg, .jpg, png formats are supported."),
  }),
);
