import { z } from "zod";
import { zfd } from "zod-form-data";

export const paymentValidation = zfd.formData({
  order_id: zfd.text(z.string()),
  transaction_status: zfd.text(z.string()),
  status_code: zfd.text(z.string()),
});
