// Courier model
interface Courier {
   company: string;
   driver_name: string; // Deprecated "name" field removed
   driver_phone: string; // Deprecated "phone" field removed
   driver_photo_url: string;
   driver_plate_number: string;
}

interface Address {
   id: string;
   name: string;
   address: string;
   contact_name: string;
   contact_phone: string;
   coordinate: Coordinate;
   postal_code: number;
}

interface History {
   note: string;
   service_type: string;
   updated_at: string;
   status: string;
}

interface Tracking {
   success: boolean;
   message: string;
   object: string;
   id: string;
   waybill_id: string;
   courier: Courier;
   origin: Address;
   destination: Address;
   history: History[];
   link: string;
   order_id: string;
   status: string;
}
