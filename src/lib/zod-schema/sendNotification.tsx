import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 5000000;
function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png" || fileType === "pdf") return true;
  }
  return false;
}

export const sendNotificationValidation = zfd.formData(
  z.object({
    title: zfd.text(z.string()),
    subtitle: zfd.text(z.string()),
    content: zfd.text(z.string()),
    file: z
      .any()
      .refine((file: File) => file !== null && file !== undefined, "file must be a file")
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
    file2: z.optional(
      z
        .any()
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && typeof file.size === "number" && file.size <= MAX_FILE_SIZE;
          }
        }, "Max size is 5MB.")
        .refine((file: File) => file !== null && file !== undefined, "file must be a file")
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && checkFileType(file);
          }
        }, "Only .jpeg, .jpg, png formats are supported."),
    ),
    file3: z.optional(
      z
        .any()
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && typeof file.size === "number" && file.size <= MAX_FILE_SIZE;
          }
        }, "Max size is 5MB.")
        .refine((file: File) => file === null && file === undefined, "file must be a file")
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && checkFileType(file);
          }
        }, "Only .jpeg, .jpg, png formats are supported."),
    ),
    file4: z.optional(
      z
        .any()
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && typeof file.size === "number" && file.size <= MAX_FILE_SIZE;
          }
        }, "Max size is 5MB.")
        .refine((file: File) => file === null && file === undefined, "file must be a file")
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && checkFileType(file);
          }
        }, "Only .jpeg, .jpg, png formats are supported."),
    ),
    file5: z.optional(
      z
        .any()
        .refine((file) => {
          if (file === "undefined") {
            return true;
          } else {
            return file && typeof file.size === "number" && file.size <= MAX_FILE_SIZE;
          }
        }, "Max size is 5MB.")
        .refine((file: File) => file === null && file === undefined, "file must be a file")
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
