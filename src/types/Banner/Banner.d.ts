import { z } from "zod";
import { BannerValidation } from "@/lib/zod-schema/banner";

interface Banner extends z.infer<typeof BannerValidation> {
  [key: string]: any;
  id?: number;
}
