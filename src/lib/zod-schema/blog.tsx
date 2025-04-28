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

export const CreateBlogValidation = zfd.formData(
  z.object({
    title: z.string(),
    subtitle: z.string(),
    content: z.string(),
    category: z.string(),
    image: z.string().base64().array(),
  }),
);

export const UpdateBlogValidation = zfd.formData(
  z.object({
    title: z.string().optional().nullable(),
    subtitle: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    image: z.string().base64().array().optional().nullable(),
  }),
);
export const categoryBlogValidationUpdate = z.object({
  id: z.number(),
});
