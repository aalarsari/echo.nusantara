export async function GetListCouriresAdmin(page: number, pageSize: number) {
   var response = await fetch(`/api/admin/couriers?page=${page}&pageSize=${pageSize}`);
   return response;
}

export async function GetDetailCouriersAdmin(id: number) {
   var response = await fetch(`/api/admin/couriers/${id}`);
   return response;
}

export async function UpdateCouriersAdmin(id: number) {
   var response = await fetch(`/api/admin/couriers/${id}`, { method: "PUT" });
   return response;
}
