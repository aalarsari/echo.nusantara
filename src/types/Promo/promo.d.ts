import { z } from "zod";
import { PromoValidation } from "@/lib/zod-schema/promo";

interface Promo extends z.infer<typeof PromoValidation> {
  [key: string]: any;
  id?: number;
}
