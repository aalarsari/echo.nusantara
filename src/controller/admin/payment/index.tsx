export async function ListPayment(params: ListPaymentParams) {
  var response = await fetch(
    `/api/admin/payment?startDate=${params.startDate}&endDate=${params.endDate}&page=${params.page}&pageSize=${params.pageSize}`,
  );
  return response;
}
export async function ConfirmPayment(orderId: string) {
  var data = {
    orderId: orderId,
  };
  var response = await fetch(`/api/admin/payment/confirm`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}
