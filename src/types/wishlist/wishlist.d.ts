import { WishlistValidation } from "@/lib/zod-schema/wishlist";
import { z } from "zod";

interface WishlistProduct extends z.infer<typeof WishlistValidation> {
  [key: string]: any;
  product: Products;
}

interface WishlistItem {
  product: Products;
}
