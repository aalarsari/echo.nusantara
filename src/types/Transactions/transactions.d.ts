interface Transaction {
  quantity?: number;
  status: ?string;
  createdAt?: Date | string;
  products?: Products;
  status?: string;
  updatedAt?: Date | string;
  amount?: number;
}

interface Payment {
  id: number;
  orderId: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  transaction: Transaction[];
  paymentType: string | null;
  Shipment: {
    price: number;
    couriers: {
      name: string;
      company: string;
    };
  };
  link: string;
  product: Products;
  user?: User;
  noteFailed: string | null;
}
