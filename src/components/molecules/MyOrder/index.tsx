"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Assets } from "@/assets";
import { GetHistoryTransaction } from "@/controller/user/transaction";
import { DateRangePicker } from "rsuite";
import { DateRange } from "rsuite/esm/DateRangePicker";
import "rsuite/dist/rsuite.css";
import moment from "moment";
import { AllOrders } from "../AllOrders";

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

export const MyOrder = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterBy, setFilterBy] = useState<string>("status");
  const [filterWith, setFilterWith] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>(
    moment().startOf("year").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(
    moment().endOf("day").format("YYYY-MM-DD"),
  );

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await GetHistoryTransaction(
          filterBy,
          filterWith,
          startDate,
          endDate,
          page,
          pageSize,
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData?.message || "Failed to fetch orders");
        }

        const orders = Array.isArray(responseData.data.payment)
          ? responseData.data.payment
          : [];

        setOrders(orders);
        const totalItems = responseData.data.count;
        setTotalPages(Math.ceil(totalItems / pageSize));
        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filterBy, filterWith, page, pageSize, startDate, endDate]);

  useEffect(() => {
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    if (JSON.stringify(sortedOrders) !== JSON.stringify(orders)) {
      setOrders(sortedOrders);
    }
  }, [orders, sortOrder]);

  const handleTabSelection = (tab: string) => {
    if (selectedTab === tab) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSelectedTab(tab);
      setFilterWith(tab === "ALL" ? "" : tab);
      setSortOrder("asc");
    }
    setPage(1);
  };

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
          className={`h-10 w-10 rounded-full ${
            page === i
              ? "bg-[#B69B7C]/[12%] text-[#C1AE94]"
              : "bg-white text-[#C1AE94]"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div>
        <DateRangePicker
          placeholder="Pilih Tanggal"
          showOneCalendar
          format="dd-MMMM-yyyy"
          className="datepicker-class h-full w-[30%]"
          onChange={(date: DateRange | null) => {
            if (date) {
              const start = moment(date[0]).format("YYYY-MM-DD");
              const end = moment(date[1]).format("YYYY-MM-DD");
              setStartDate(start);
              setEndDate(end);
              setPage(1);
            }
          }}
          placement="bottomStart"
        />
      </div>
      <div className="mt-4">
        <div className="scrollbar-hide flex w-full overflow-x-auto">
          {["ALL", "NEW", "PAID", "PROCESS"].map((tab, idx) => (
            <div
              key={idx}
              className={clsx(
                "flex w-[55%] flex-shrink-0 cursor-pointer items-center justify-center gap-2 px-4 py-2 font-josefins text-[16px] text-[#7D716A] md:w-[25%]",
                selectedTab === tab
                  ? "border-b-[2px] border-[#7D716A]"
                  : "border-0",
              )}
              onClick={() => {
                handleTabSelection(tab);
              }}
            >
              <span>{tab}</span>
              <Image
                src={Assets.IconFilter}
                width="15"
                height="15"
                alt="Icon Filter"
              />
            </div>
          ))}
        </div>
        <div className="no-scroll no-scrollbar relative mt-2 h-[70vh] overflow-y-auto rounded-[4px]">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              Loading...
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <AllOrders orders={orders} />
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center space-x-2">
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
    </div>
  );
};
