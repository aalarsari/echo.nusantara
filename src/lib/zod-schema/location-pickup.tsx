import { z } from "zod";
import { zfd } from "zod-form-data";

export const CreateLocationPickupValidation = zfd.formData({
   contactName: z.string().min(1),
   contactPhone: z.string().min(1),
   address: z.string().min(1),
   postalCode: z.number().min(1),
   note: z.string().min(1),
});
