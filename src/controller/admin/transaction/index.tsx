export async function ListTransaction(params: ListTransactionParams) {

   var response = await fetch(
      `/api/admin/transaction?filterBy=${params.filterBy}&filterWith=${params.filterWith}&startDate=${params.startDate}&endDate=${params.endDate}&page=${params.page}&pageSize=${params.pageSize}&search=${params.search}`,
   );
   return response;
}

export async function DoneTransaction(orderId: string) {
   var data = {
      orderId: orderId,
   };
   var response = await fetch(`/api/admin/transaction/done`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
         "Content-type": "application/json",
      },
   });
   return response;
}
export async function Transaction(orderId: string) {
   var response = await fetch(`/api/admin/transaction/confrim?orderId=${orderId}`);
   return response;
}

export async function GetDetailTrackingAdmin(orderId: string) {
   var response = await fetch(`/api/admin/transaction/${orderId}/tracking`);
   return response;
}

export async function GetDetailTransactionsAdmin(orderId: string) {
   var response = await fetch(`/api/admin/transaction/${orderId}`);
   return response;
}
