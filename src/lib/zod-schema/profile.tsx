// ini untuk update user pada admin

import { Gander } from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";
export var role = z.enum(["ADMIN", "USER"]);
export var gander = z.enum([Gander.Female, Gander.Male]);

export const profileUpdate = zfd.formData(
  z.object({
    email: z
      .string({
        required_error: " Email is required",
      })
      .email({ message: "Invalid email address" }),
    name: z.string({
      required_error: "Name is required",
    }),
    phone: z
      .string({
        required_error: "Phone is required",
      })
      .min(10, { message: "Must be 10 or more characters long" })
      .max(12, { message: "Must be 12 or fewer characters long" }),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    gander: gander.optional().nullable(),
  }),
);

const MAX_FILE_SIZE = 5000000;
function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") return true;
  }
  return false;
}

export const photoProfileUpdate = zfd.formData(
  z.object({
    photo: z
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
  }),
);

export const profileUpdatePassword = zfd.formData(
  z
    .object({
      password: z
        .string({ required_error: "Password is required" })
        .min(5, { message: "Must be 5 or more characters long" })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter",
        })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number",
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Password must contain at least one special character",
        }),
      confirmPassword: z
        .string({ required_error: "Confirm Password is required" })
        .min(5, { message: "Must be 5 or more characters long" })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter",
        })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number",
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Password must contain at least one special character",
        }),
      oldPassword: z.string().min(5, { message: "Must be 5 or more characters long" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and Confirm Password must match",
      path: ["confirm"],
    }),
);
