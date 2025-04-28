interface Order {
  id: number;
  orderId: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  transaction: Transaction[];
  paymentType: string | null;
  Shipment: {
    price: number | null;
    couriers: {
      name: string | null;
      company: string | null;
    };
    updatedAt: Date | string;
  };
  link: string;
  user: User;
}
