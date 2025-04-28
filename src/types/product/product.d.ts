interface Products {
   [key: string]: any;
   id?: number;
   name?: string;
   descriptions?: string;
   subDescriptions?: string | null;
   slug?: string;
   // priceUSD?: number;
   Dicount?: Discount[];
   priceIDR?: number;
   quantity?: number;
   value?: number;
   weight?: number;
   stock?: number;
   maxOrder?: number;
   categoryId?: number;
   ReviewProduct?: ReviewProduct[];
   image1?: string;
   image2?: string | null;
   image3?: string | null;
   image4?: string | null;
   image5?: string | null;
   size?: string | null;
   createdAt?: Date;
   createdBy?: string;
   updateAt?: Date;
   updateBy?: string;
   category?: CategoryProducts | null;
}

interface ReviewProduct {
   review: string;
   rate: number | null;
   updatedAt: Date;
   createdAt: Date;
   user: User;
}

interface Discount {
  id: number;
  subject: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  productPrice: number;
}
