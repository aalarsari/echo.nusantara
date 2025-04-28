"use client";

import { useState, useEffect } from "react";
import {
  GetDetailTrackingUser,
  GetDetailTranscation,
} from "@/controller/user/transaction";
import "rsuite/dist/rsuite.css";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderDetailsModal } from "@/components/atoms/OrderDetailsModal";
import { AllOrdersCard } from "@/components/atoms/AllOrderCard";
import { AxiosError } from "axios";

interface Order {
  id: number;
  orderId: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  transaction: Transaction[];
  paymentType: string | null;
  Shipment: {
    price: number;
    couriers: {
      name: string;
      company: string;
    };
  };
  link: string;
  product: Products;
}

export const AllOrders: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [detailTracking, setDetailTracking] = useState<Tracking | null>(null);
  const [detailTransactions, setDetailTransactions] = useState<
    Transaction[] | null
  >(null);
  const [indexDetailTransactions, SetIndexDetailTransactions] = useState<
    number | null
  >(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<
    string | AxiosError | undefined
  >(undefined);
  const detailId = searchParams.get("id");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(2);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (detailId) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [detailId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!detailId) return;

      setLoadingDetail(true);
      try {
        const [transResponse, trackResponse] = await Promise.all([
          GetDetailTranscation(detailId),
          GetDetailTrackingUser(detailId),
        ]);

        const transData = await transResponse.json();
        const trackData = await trackResponse.json();

        const transactions = Array.isArray(transData?.data?.transaction)
          ? transData.data.transaction
          : [];

        const tracking = trackData?.data;
        console.log(transactions, "Manatpappp");

        setDetailTransactions(transactions);
        setDetailTracking(tracking);
        setErrorDetail(undefined);
      } catch (error) {
        console.error(error);
        setErrorDetail("Failed to load transaction details. Please try again.");
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchData();
  }, [detailId]);

  const handleOpenModal = (id: string, index?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", id);
    router.push(`/profile?${params.toString()}`);
    SetIndexDetailTransactions(index!);
  };

  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    router.push(`/profile?${params.toString()}`);
    setDetailTransactions(null);
    setDetailTracking(null);
  };

  return (
    <div className="relative h-full overflow-auto p-2">
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <AllOrdersCard
            key={order.id}
            orders={order}
            onOpenModal={() => handleOpenModal(order.orderId, index)}
          />
        ))
      ) : (
        <div className="flex h-full items-center justify-center">
          Loading . . .
        </div>
      )}

      {detailId && indexDetailTransactions !== null && (
        <OrderDetailsModal
          isOpen={!!detailId}
          onClose={handleCloseModal}
          transactionDetails={detailTransactions || []}
          trackingDetails={detailTracking}
          orders={orders[indexDetailTransactions]}
          loading={loadingDetail}
          error={errorDetail}
        />
      )}
    </div>
  );
};
