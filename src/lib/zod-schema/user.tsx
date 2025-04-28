// ini untuk update user pada admin

import { z } from "zod";
import { zfd } from "zod-form-data";
import { Gander, Role, Prisma } from "@prisma/client";

export var gander = z.enum([Gander.Female, Gander.Male]);
export var role = z.enum([Role.ADMIN, Role.USER, Role.LOGISTIC, Role.SALES,Role.SUPER_ADMIN]);
export const RegisterValidation = zfd.formData(
   z
      .object({
         email: z.string({ required_error: " Email is required" }).email({ message: "Invalid email address" }),
         name: z.string({ required_error: "Name is required" }),
         phone: z
            .string({ required_error: "Phone is required" })
            .min(10, { message: "Must be 10 or more characters long" })
            .max(12, { message: "Must be 12 or fewer characters long" }),

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
      })
      .refine((data) => data.password === data.confirmPassword, {
         message: "Password and Confirm Password must match",
         path: ["confirm"],
      }),
);

export const AnonymusRegisterValidation = zfd.formData(
   z.object({
      email: z.string({ required_error: " Email is required" }).email({ message: "Invalid email address" }),
      name: z.string({ required_error: "Name is required" }),
      phone: z
         .string({ required_error: "Phone is required" })
         .min(10, { message: "Must be 10 or more characters long" })
         .max(12, { message: "Must be 12 or fewer characters long" }),
      postalCode: z.string({ required_error: "Postal Code is required" }),

      city: z.string({ required_error: "City is required" }),
      address: z.string({ required_error: "Address is required" }),
   }),
);

export const UserValidation = zfd.formData(
   z
      .object({
         email: z
            .string({
               required_error: " Email is required",
            })
            .email({ message: "Invalid email address" }),
         name: z.string({ required_error: "Name is required" }),
         phone: z
            .string({ required_error: "Phone is required" })
            .min(10, { message: "Must be 10 or more characters long" })
            .max(12, { message: "Must be 12 or fewer characters long" }),
         role: role,
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
         country: z.string({ required_error: "Country is required" }),
         postalCode: z.string({ required_error: "Postal Code is required" }),
         kelurahan: z.string({ required_error: "Keluruahan is required" }),
         kecematan: z.string({ required_error: "Kecamatan is required" }),
         city: z.string({ required_error: "City is required" }),
         address: z.string({ required_error: "Address is required" }),
         gander,
      })
      .refine((data) => data.password === data.confirmPassword, {
         message: "Password and Confirm Password must match",
         path: ["confirm"],
      }),
);

export const UserUpdateValidation = zfd.formData(
   z.object({
      email: z.string().optional().nullable(),
      name: z.string().optional().nullable(),
      phone: z.string().optional().nullable(),
      gander: gander.optional().nullable(),
      password: z.string().optional().nullable(),
      confirmPassword: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      postalCode: z.string().optional().nullable(),
      kelurahan: z.string().optional().nullable(),
      kecematan: z.string().optional().nullable(),
   }),
);

export const AscDescValidation = z.enum([Prisma.SortOrder.asc, Prisma.SortOrder.desc]);
export const NameOrderByValidation = z.enum(["name", "email", "price", "stock"]);
