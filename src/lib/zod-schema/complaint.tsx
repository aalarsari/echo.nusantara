import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 5000000;
function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png")
      return true;
  }
  return false;
}

export const ComplainValidaton = zfd.formData(
  z.object({
    orderId: z.string({
      required_error: "OrderId is required",
      invalid_type_error: "OrderId must number",
    }),
    complaint: z.string({
      required_error: "Complaint is required",
      invalid_type_error: "ComplaintId must number",
    }),
    photo: z.optional(
      z
        .any()
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return (
              file &&
              typeof file.size === "number" &&
              file.size <= MAX_FILE_SIZE
            );
          }
        }, "Max size is 5MB.")
        .refine(
          (file: File) => file !== null && file !== undefined,
          "Image4 must image",
        )
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && checkFileType(file);
          }
        }, "Only .jpeg, .jpg, png formats are supported."),
    ),
  }),
);
