"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import { Notifications } from "@/components/atoms";
import { DateRangePicker } from "rsuite";
import { DateRange } from "rsuite/esm/DateRangePicker";
import "rsuite/dist/rsuite.css";
import { ConfirmPayment, ListPayment } from "@/controller/admin/payment";
import { useSession } from "next-auth/react";
import { $Enums } from "@prisma/client";

export default function Payments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>(
    moment().startOf("year").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(
    moment().endOf("day").format("YYYY-MM-DD"),
  );
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await ListPayment({
          startDate,
          endDate,
          page,
          pageSize,
        });
        const data = await response.json();
        const totalItems = data.data.count;
        setTotalPages(Math.ceil(totalItems / pageSize));
        if (data && data.data.payment) {
          setPayments(data.data.payment);
        } else {
          setError("No payments found");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch payments");
        setLoading(false);
      }
    };

    fetchPayments();
  }, [page, pageSize, startDate, endDate]);

  const handleConfirm = async (orderId: string) => {
    try {
      const response = await ConfirmPayment(orderId);

      if (response.ok) {
        showNotification(
          `${orderId} Transaction Confirmed Successfully!`,
          "success",
        );

        setIsConfirmed(true);
      } else {
        const errorData = await response.json();
        showNotification(
          `Internal Server Error: ${errorData.message}`,
          "error",
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showNotification(errorMessage, "error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(page - Math.floor(maxPageNumbersToShow / 2), 1);
    let endPage = startPage + maxPageNumbersToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`h-10 w-10 rounded-full ${page === i ? "bg-[#B69B7C]/[12%] text-[#C1AE94]" : "bg-white text-[#C1AE94]"}`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  const handleTrack = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  const handleExportPayment = async () => {
    const query = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
    }).toString();

    try {
      const response = await fetch(`/api/admin/payment/download?${query}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const formattedStartDate = moment(startDate).format("DD MMMM YYYY");
      const formattedEndDate = moment(endDate).format("DD MMMM YYYY");
      const fileName = `Data Payment ${formattedStartDate} to ${formattedEndDate}.xlsx`;

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <main className="relativeve flex h-full w-full flex-col gap-2">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="mb-2 flex w-full flex-col items-center justify-between md:flex-row">
        <span className="w-[50%] font-domaine text-[20px] text-[#252525]">
          All Payment
        </span>
        <div className="flex w-[50%] flex-row gap-4">
          <div className="relative w-full items-center">
            <DateRangePicker
              placeholder="Pilih Tanggal"
              showOneCalendar
              format="dd-MMMM-yyyy"
              className="custom-date-picker h-full w-full"
              onChange={(date: DateRange | null) => {
                if (date) {
                  const start = moment(date[0]).format("YYYY-MM-DD");
                  const end = moment(date[1]).format("YYYY-MM-DD");
                  setStartDate(start);
                  setEndDate(end);
                }
                setShowDateRangePicker(false);
              }}
              placement="bottomStart"
            />
          </div>
          <button
            onClick={handleExportPayment}
            className="w-[50%] rounded-md bg-gradient-to-t from-[#B69B78] to-[#CDB698] p-2 font-domaine font-semibold text-white"
          >
            Export Data Payments
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-100 border border-gray-100">
          <thead className="bg-[#B69B7C]/[12%]">
            <tr>
              <th className="border border-gray-100 px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                No
              </th>
              <th className="border border-gray-100 px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Date
              </th>
              <th className="border border-gray-100 px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Order
              </th>
              <th className="border border-gray-100 px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Name
              </th>
              {(role === $Enums.Role.LOGISTIC ||
                role === $Enums.Role.ADMIN) && (
                <>
                  <th className="border border-gray-100 px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                    Noted
                  </th>
                  <th className="border border-gray-100 px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                    Status
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {payments.map((payment, index) => (
              <tr key={payment.id}>
                <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                  {(page - 1) * pageSize + (index + 1)}
                </td>
                <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                  {moment(payment.createdAt).format("DD MMMM YYYY, HH:mm:ss")}
                </td>
                <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                  {payment.orderId}
                </td>
                <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                  {payment.user?.name}
                </td>
                {(role === $Enums.Role.LOGISTIC ||
                  role === $Enums.Role.ADMIN) && (
                  <>
                    <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                      {payment.noteFailed || "Not Paid"}
                    </td>
                    <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                      <div className="flex items-center justify-center space-x-2">
                        {payment.status === "SUCCESS" && !isConfirmed && (
                          <button
                            className="w-[6rem] rounded bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-2 py-1 text-white"
                            onClick={() => handleConfirm(payment.orderId)}
                          >
                            Confirm
                          </button>
                        )}
                        {payment.status === "SUCCESS" && isConfirmed && (
                          <button
                            className="w-[6rem] rounded bg-gradient-to-t from-[#4CAF50] to-[#81C784] px-2 py-1 text-white"
                            onClick={() => handleTrack(payment.orderId)}
                          >
                            Track
                          </button>
                        )}
                        {payment.status === "PENDING" && (
                          <span className="text-josefins w-[6rem] rounded bg-gray-100 px-2 py-1 text-[14px] font-semibold text-gray-500">
                            Pending
                          </span>
                        )}
                        {payment.status !== "PENDING" &&
                          payment.status !== "SUCCESS" && (
                            <span
                              className={`text-josefins rounded px-2 py-1 text-[14px] ${
                                payment.status === "DECLINE"
                                  ? "bg-red-100 text-red-500"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {payment.status}
                            </span>
                          )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="rounded-md bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-8 py-2 text-white"
        >
          Prev
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-md bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-8 py-2 text-white"
        >
          Next
        </button>
      </div>
    </main>
  );
}
