import { optional, z } from "zod";
import { zfd } from "zod-form-data";

export const checkoutValidation = zfd.formData({
  cartIds: zfd.numeric(
    z
      .number({
        required_error: "cartIds is required",
        invalid_type_error: "cartIds must number",
      })
      .array()
      // .nonempty({ message: "Can't be empty!" }),
  ),
  couriersCode: zfd.text(
    z.string({
      required_error: "couriersCode is required",
    }),
  ),
  courierServiceCode: zfd.text(
    z.string({
      required_error: "courierServiceCode is required",
    }),
  ),
});

export const confirmTransactionValidation = zfd.formData({
  orderId: zfd.text(
    z.string({
      required_error: "OrderId is required",
      invalid_type_error: "OrderId must string",
    }),
  ),
});

export const capturePaymentValidation = zfd.formData({
  orderId: zfd.text(
    z.string({
      required_error: "OrderId is required",
      invalid_type_error: "OrderId must string",
    }),
  ),
});

export const paypalValidation = zfd.formData({
  id: zfd.text(),
});
