import { z } from "zod";
import { zfd } from "zod-form-data";

export const ShipmentUpdateValidation = zfd.formData(
   z.object({
      status: z.string().nullable().optional(),
   }),
);

export const CreateShipment = zfd.formData({
   cartIds: zfd.numeric(
      z
         .number({
            required_error: "cartIds is required",
            invalid_type_error: "cartIds must number",
         })
         .array()
         .nonempty({ message: "Can't be empty!" }),
   ),
   couriers: zfd.text(z.string().array()),
});

export type CreateShipmentType = z.infer<typeof CreateShipment>;
