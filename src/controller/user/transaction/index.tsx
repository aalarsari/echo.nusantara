import {
  checkoutValidation,
  confirmTransactionValidation,
} from "@/lib/zod-schema/transaction";
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import { useSearchParams } from "next/navigation";
import { number, z } from "zod";

export async function Checkout(data: z.infer<typeof checkoutValidation>) {
  var response = await fetch(`/api/user/transaction/checkout`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function GetDataCheckout(cartids: number[]) {
  const url = new URL("/api/user/cart/list", window.location.origin);
  url.searchParams.append("cartid", cartids.join(","));
  var response = await fetch(url);
  return response;
}
export async function TransactionConfirm(
  data: z.infer<typeof confirmTransactionValidation>,
) {
  var response = await fetch(`/api/user/transaction/confirm-success`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function GetHistoryTransaction(
  filterBy: string,
  filterWith: string,
  starDate: string,
  endDate: string,
  page: number,
  pageSize: number,
) {
  var response = await fetch(
    `/api/user/transaction?filterBy=${filterBy}&filterWith=${filterWith}&startDate=${starDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`,
  );
  return response;
}

export async function CreateOrder(
  create: z.infer<typeof checkoutValidation>,
  data: CreateOrderData,
  action: CreateOrderActions,
) {
  // Order is created on the server and the order id is returned
  const res = await fetch("/api/user/transaction/checkout", {
    method: "POST",
    body: JSON.stringify(create),
  });
  const body = await res.json();
  var orderId = body.data.json.id;

  return orderId;
}
export async function onAprove(data: OnApproveData, action: OnApproveActions) {
  const res = await fetch("/api/user/transaction/checkout/capture-paypal", {
    method: "POST",
    body: JSON.stringify({
      orderId: data.orderID,
    }),
  });
  const body = await res.json();

  return body;
}
export async function onCancel(data: any) {
  const res = await fetch("/api/user/transaction/checkout/cancel-paypal", {
    method: "POST",
    body: JSON.stringify({
      orderId: data.orderID,
    }),
  });
  const body = await res.json();

  return body;
}

export async function GetDetailTranscation(orderId: string) {
  var response = await fetch(`/api/user/transaction/${orderId}`);
  return response;
}

export async function GetDetailTrackingUser(orderId: string) {
  var response = await fetch(`/api/user/transaction/${orderId}/tracking`);
  return response;
}

export async function TransactionStatus(orderId: string) {
  var response = await fetch(`/api/user/transaction/${orderId}/status-payment`);
  return response;
}
