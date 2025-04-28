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

export const SocialMediaValidation = zfd.formData(
   z.object({
      image: z
         .any()
         .refine((file: File) => {
            if (file) return true;
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
      link: z.string({
         required_error: "link is required",
      }),
      name: z.string({
         required_error: "Name is required",
      }),
   }),
);

export const SocialMediaUpdateValidation = zfd.formData(
   z.object({
      image: z.any(),
      link: z
         .string({
            required_error: "link is required",
         })
         .optional()
         .nullable(),
      name: z
         .string({
            required_error: "Name is required",
         })
         .optional()
         .nullable(),
   }),
);
