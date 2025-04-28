import { z } from "zod";

export const topSellerValidation = z.enum(["year", "month", "day"]);
export const grafikValidation = z.enum([
  "Revenue",
  "Total Orders",
  "Total Customers",
  "Items Sold",
]);

export type topSallerEnum = z.infer<typeof topSellerValidation>;
export type grafikEnum = z.infer<typeof grafikValidation>;

export const combinedValidationSchema = z.object({
  topSeller: topSellerValidation,
  grafik: grafikValidation,
});

export type CombinedFormData = z.infer<typeof combinedValidationSchema>;
