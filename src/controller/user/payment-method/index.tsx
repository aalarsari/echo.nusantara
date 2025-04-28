export async function GetPaymentMethod() {
  var response = await fetch("/api/user/payment-method");
  return response;
}
