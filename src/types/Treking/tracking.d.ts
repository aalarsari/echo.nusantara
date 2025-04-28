interface Treking {
  id: string;
  link: string;
  message: string;
  object: string;
  order_id: string;
  origin: {
    address: string;
    contact_name: string;
  };
  destination: {
    address: string;
    contact_name: string;
  };
  courier: {
    company: string | null;
    driver_name: string | null;
    driver_phone: string | null;
    name: string | null;
    phone: string | null;
  };
  history: {
    note: string;
    service_type: string;
    status: string;
    updated_at: string;
  }[];
  status: string;
  success: boolean;
  waybill_id: string;
}
