interface OrderResponse {
  success: boolean;
  message: string;
  object: string;
  id: string;
  shipper: Shipper;
  origin: LocationDetails;
  destination: DestinationDetails;
  stops: any[];
  courier: CourierDetails;
  delivery: DeliveryDetails;
  reference_id: string | null;
  items: Products[];
  extra: any[];
  price: number;
  note: string;
  status: string;
}

interface Shipper {
  name: string;
  email: string;
  phone: string;
  organization: string;
}

interface LocationDetails {
  contact_name: string;
  contact_phone: string;
  coordinate: Coordinate;
  address: string;
  note: string;
  postal_code: number;
  collection_method: string;
}

interface DestinationDetails extends LocationDetails {
  contact_email: string;
  proof_of_delivery: ProofOfDelivery;
  cash_on_delivery: CashOnDelivery;
}

interface ProofOfDelivery {
  use: boolean;
  fee: number;
  note: string | null;
  link: string | null;
}

interface CashOnDelivery {
  id: string | null;
  amount: number;
  fee: number;
  note: string | null;
  type: string | null;
  status: string | null;
  payment_status: string;
  payment_method: string;
}

interface CourierDetails {
  tracking_id: string;
  waybill_id: string;
  company: string;
  name: string | null;
  phone: string | null;
  type: string;
  link: string | null;
  insurance: Insurance;
  routing_code: string | null;
}

interface Insurance {
  amount: number;
  fee: number;
  note: string;
}

interface DeliveryDetails {
  datetime: string;
  note: string | null;
  type: string;
  distance: number | null;
  distance_unit: string;
}
