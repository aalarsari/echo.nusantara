interface Shipment {
   shipper_contact_name: string;
   shipper_contact_phone: string;
   shipper_contact_email: string;
   shipper_organization: string;
   origin_contact_name: string;
   origin_contact_phone: string;
   origin_address: string;
   origin_note?: string;
   origin_postal_code?: number;
   origin_coordinate?: Coordinate;
   origin_collection_method?: string;
   destination_contact_name: string;
   destination_contact_phone: string;
   destination_contact_email: string;
   destination_address: string;
   destination_postal_code?: number;
   destination_coordinate?: Coordinate;

   destination_note?: string;
   destination_cash_on_delivery?: number;
   destination_cash_on_delivery_type?: string;
   courier_company: string;
   courier_type: string;
   delivery_type: string;
   order_note?: string;
   items: Products[];
}

interface ShipmentPrice {
   origin_latitude?: number; // Optional because not all entries have latitude
   origin_longitude?: number; // Optional because not all entries have longitude
   origin_postal_code?: number; // Optional because not all entries have postal code
   origin_area_id?: string; // Optional because not all entries have area ID
   destination_latitude?: number; // Optional because not all entries have latitude
   destination_longitude?: number; // Optional because not all entries have longitude
   destination_postal_code?: number; // Optional because not all entries have postal code
   destination_area_id?: string; // Optional because not all entries have area ID
   couriers: string; // Assuming couriers are provided as a comma-separated string
   items: Products[]; // Array of items
}
