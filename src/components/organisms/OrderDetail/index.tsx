"use client";

import { FormatRupiah, Notifications } from "@/components/atoms";
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";
import {
  GetDetailTrackingAdmin,
  GetDetailTransactionsAdmin,
} from "@/controller/admin/transaction";
import moment from "moment";

import { useRouter } from "next/navigation";

interface OrderDetailProps {
  orderId: string;
}
export const OrderDetail: React.FC<OrderDetailProps> = ({ orderId }) => {
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const [editMode, setEditMode] = useState(false);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const [orderDetails, setOrderDetails] = useState<Treking | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<Payment | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetailsAndTransactions = async () => {
        setLoading(true);
        try {
          const [orderDetailsResponse, transactionDetailsResponse] =
            await Promise.all([
              GetDetailTrackingAdmin(orderId as string),
              GetDetailTransactionsAdmin(orderId as string),
            ]);
          let tracking = null;
          if (orderDetailsResponse.ok) {
            const orderDetailsData = await orderDetailsResponse.json();
            tracking = orderDetailsData.data;
          } else if (orderDetailsResponse.status === 400) {
            tracking = null;
          } else {
            throw new Error("Unexpected error fetching order details");
          }

          if (!transactionDetailsResponse.ok) {
            throw new Error("Failed to fetch transaction details");
          }

          const transactionDetailsData =
            await transactionDetailsResponse.json();
          const transactions = transactionDetailsData.data;

          console.log("Transaction Details:", transactions);
          console.log("Order Details:", tracking);
          setOrderDetails(tracking);
          setTransactionDetails(transactions);

          setError(null);
        } catch (error) {
          setError("An unexpected error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetailsAndTransactions();
    }
  }, [orderId]);

  if (error) return <div>{error}</div>;

  return (
    <div className="relative flex h-full w-full flex-col gap-2">
      <div className="rounded-[4px] bg-white p-8 shadow-md">
        <Notifications
          message={notification.message}
          type={notification.type}
          visible={notification.visible}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
        {transactionDetails ? (
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="font-domaine text-[20px] text-[#252525]">
                    Order Details
                  </h2>
                  <div
                    className={`items-center justify-center rounded px-2 text-sm font-bold ${
                      transactionDetails.transaction[0].status === "PROCESS"
                        ? "bg-[#FFA500]/20 text-[#FFA500]"
                        : transactionDetails.transaction[0].status === "DONE"
                          ? "bg-green-100 text-green-500"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {transactionDetails.transaction[0].status}
                  </div>
                </div>
                <button
                  // onClick={exportPDF}
                  className="mt-4 rounded bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-4 py-2 text-white"
                >
                  Export PDF
                </button>
              </div>
              {orderDetails ? (
                <a
                  href={orderDetails.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="appearance-none rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-4 py-1 font-domaine text-[16px] font-light text-white hover:text-white hover:no-underline"
                >
                  Tracking
                </a>
              ) : transactionDetails &&
                transactionDetails.transaction[0]?.status === "NEW" ? (
                <a
                  href={transactionDetails.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="appearance-none rounded bg-gradient-to-t from-[#FFA500] to-[#FFC078] px-6 py-2 text-sm font-bold text-white no-underline outline-none hover:text-white hover:no-underline"
                >
                  Payment Link
                </a>
              ) : null}
            </div>
            <div className="mt-2 flex w-full flex-col gap-2">
              <div className="mt-4 flex w-full items-center justify-between gap-2">
                {orderDetails ? (
                  <div className="flex items-center gap-2">
                    <span className="font-domaine text-[16px] text-[#231F20]">
                      Order ID :
                    </span>
                    <span className="font-domaine text-[16px] uppercase text-[#231F20]">
                      {orderDetails.order_id}
                    </span>
                  </div>
                ) : transactionDetails ? (
                  <div className="flex items-center gap-2">
                    <span className="font-domaine text-[16px] text-[#231F20]">
                      Transaction Order ID :
                    </span>
                    <span className="font-domaine text-[16px] uppercase text-[#231F20]">
                      {transactionDetails.orderId}
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center gap-2">
                  <span className="font-domaine text-[16px] text-[#231F20]">
                    Data :
                  </span>
                  <span className="font-domaine text-[16px] uppercase text-[#231F20]">
                    {moment(
                      transactionDetails.transaction[0].createdAt ||
                        "Date not available",
                    ).format("DD MMMM YYYY, HH:mm")}
                  </span>
                </div>
              </div>
              <div className="h-full w-full overflow-auto">
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className="flex w-full gap-2">
                        <div className="relative h-24 w-24 overflow-hidden rounded">
                          <Image
                            src={
                              transactionDetails.transaction[0].products
                                ?.image1 || ""
                            }
                            width={100}
                            height={100}
                            objectFit="cover"
                            alt={
                              transactionDetails.transaction[0].products
                                ?.name || "Product"
                            }
                          />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                          <span className="font-josefins text-sm font-bold">
                            {transactionDetails.transaction[0].products?.name}
                          </span>
                          <span className="font-josefins text-sm font-light">
                            {
                              transactionDetails.transaction[0].products
                                ?.subDescriptions
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full gap-2">
                        <div className="flex w-full justify-end ">
                          <span className="font-josefins text-sm font-bold">
                            {transactionDetails.transaction[0].quantity} Item
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <>
                    <hr className="my-1 border-t-[0.5px] border-gray-400" />
                    <div className="flex flex-col gap-2">
                      <h2 className="font-josefins text-[16px] text-[#231F20]">
                        Customer Information
                      </h2>
                      <div className="flex h-[6rem] flex-col gap-2">
                        {orderDetails ? (
                          <div className="flex flex-row gap-2">
                            <div className="flex w-[6rem] flex-row justify-between">
                              <span className="font-domaine text-[16px] text-[#231F20]">
                                Courier
                              </span>
                              <span className="font-domaine text-[16px] text-[#231F20]">
                                :
                              </span>
                            </div>
                            <span className="font-domaine text-[16px] text-[#231F20]">
                              {orderDetails.courier.company
                                ? orderDetails.courier.company
                                    .charAt(0)
                                    .toUpperCase() +
                                  orderDetails.courier.company.slice(1)
                                : "Unknown Company"}{" "}
                              -{" "}
                              {orderDetails.history?.[0]?.service_type
                                ? orderDetails.history[0].service_type
                                    .charAt(0)
                                    .toUpperCase() +
                                  orderDetails.history[0].service_type.slice(1)
                                : "Unknown Service"}
                            </span>
                          </div>
                        ) : transactionDetails &&
                          transactionDetails.transaction[0]?.status ===
                            "NEW" ? (
                          <div className="flex flex-row gap-2">
                            <div className="flex w-[6rem] flex-row justify-between">
                              <span className="font-domaine text-[16px] text-[#231F20]">
                                Courier
                              </span>
                              <span className="font-domaine text-[16px] text-[#231F20]">
                                :
                              </span>
                            </div>
                            <span className="font-domaine text-[16px] text-[#231F20]">
                              {transactionDetails.Shipment.couriers.name
                                ? transactionDetails.Shipment.couriers.name
                                    .charAt(0)
                                    .toUpperCase() +
                                  transactionDetails.Shipment.couriers.name.slice(
                                    1,
                                  )
                                : "Unknown Company"}{" "}
                            </span>
                          </div>
                        ) : null}
                        {orderDetails ? (
                          <>
                            <div className="flex flex-row gap-2">
                              <div className="flex w-[6rem] flex-row justify-between">
                                <span className="font-domaine text-[16px] text-[#231F20]">
                                  No Resi
                                </span>
                                <span className="font-domaine text-[16px] text-[#231F20]">
                                  :
                                </span>
                              </div>
                              <span className="font-domaine text-[16px] text-[#231F20]">
                                {orderDetails.waybill_id}
                              </span>
                            </div>
                            <div className="flex flex-row gap-2">
                              <div className="flex w-[6rem] flex-row justify-between">
                                <span className="font-domaine text-[16px] text-[#231F20]">
                                  Address
                                </span>
                                <span className="font-domaine text-[16px] text-[#231F20]">
                                  :
                                </span>
                              </div>
                              <span className="font-domaine text-[16px] text-[#231F20]">
                                {orderDetails.destination.address}
                              </span>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </>

                  <hr className="my-1 border-t-[0.5px] border-gray-400" />
                  <div className="flex h-[8rem] flex-col gap-2">
                    <span className="font-josefins text-[16px] text-[#231F20]">
                      Rincian Pembayaran
                    </span>
                    <div className="flex flex-row justify-between">
                      <span className="font-domaine text-[16px] text-[#231F20]">
                        Metode Pembayaran
                      </span>
                      <span className="font-domaine text-[16px] text-[#231F20]">
                        {transactionDetails.paymentType}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="font-domaine text-[16px] text-[#231F20]">
                        Subtotal Harga Barang
                      </span>
                      <span className="font-domaine text-[16px] text-[#231F20]">
                        <FormatRupiah
                          price={
                            transactionDetails.transaction[0].products!
                              .priceIDR || 0
                          }
                        />
                      </span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="font-domaine text-[16px] text-[#231F20]">
                        Total Ongkos Kirim
                      </span>
                      <span className="font-domaine text-[16px] text-[#231F20]">
                        <FormatRupiah
                          price={transactionDetails.Shipment.price || 0}
                        />
                      </span>
                    </div>
                  </div>
                  <hr className="my-1 border-t-[0.5px] border-gray-400" />
                  <div className="flex w-full flex-row justify-between">
                    <span className="font-domaine text-[20px] font-semibold text-[#231F20]">
                      Total Belanja
                    </span>
                    <span className="font-domaine text-xl text-[#231F20]">
                      <FormatRupiah price={transactionDetails.amount || 0} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-screen w-full items-center justify-center">
            Loading...
          </div>
        )}
      </div>
      <button
        onClick={() => router.back()}
        className="h-[2.5rem] w-[8rem] transform rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] font-josefins text-[16px] text-white transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82]"
      >
        Back
      </button>
    </div>
  );
};
