import { $Enums } from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";

var contactEnum = z.enum([
  $Enums.QuestionsUserCategory.BUSINESS,
  $Enums.QuestionsUserCategory.GENERAL,
]);

export const ContactValidations = zfd.formData(
  z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Question is required",
    }),
    nohandphone: z.string({
      required_error: "No Handphone is required",
    }),
    category: contactEnum,
  }),
);
