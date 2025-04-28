import { z } from "zod";

export const resetPasswordValidation = z
   .object({
      email: z
         .string({
            required_error: "email is required",
         })
         .email({})
         .min(1),
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
   });

export const prepareResetPassword = z.object({
   email: z
      .string({
         required_error: "email is required",
      })
      .email({})
      .min(1),
});
