interface Courier {
   available_for_cash_on_delivery: boolean;
   available_for_proof_of_delivery: boolean;
   available_for_instant_waybill_id: boolean;
   courier_name: string;
   courier_code: string;
   courier_service_name: string;
   courier_service_code: string;
   tier: string;
   description: string;
   service_type: string;
   shipping_type: string;
   shipment_duration_range: string;
   shipment_duration_unit: string;
}
export interface CourierResponse {
   success: boolean;
   object: string;
   couriers: Courier[];
}
