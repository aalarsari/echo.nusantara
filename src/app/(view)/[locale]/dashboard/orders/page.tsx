"use client";

import { ListTransaction } from "@/controller/admin/transaction";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import { DateRangePicker } from "rsuite";
import { DateRange } from "rsuite/esm/DateRangePicker";
import "rsuite/dist/rsuite.css";
import { useRouter } from "next/navigation";
import { Asset } from "next/font/google";
import { useSession } from "next-auth/react";
import { $Enums } from "@prisma/client";

interface Treking {
  orderId: string;
  trackingLink: string;
}
export default function Orders() {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [shippings, setShipping] = useState<Payment[]>([]);
  const [tracking, setTracking] = useState<Treking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<string>("status");
  const [filterWith, setFilterWith] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState<string>("");
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [startDate, setStartDate] = useState<string>(
    moment().startOf("year").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(
    moment().endOf("day").format("YYYY-MM-DD"),
  );

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await ListTransaction({
          filterBy,
          filterWith,
          startDate,
          endDate,
          page,
          pageSize,
          search,
        });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData?.message || "Failed to fetch orders");
        }

        const shipping = Array.isArray(responseData.data.payment)
          ? responseData.data.payment
          : [];

        const tracking = Array.isArray(responseData.data.tracking)
          ? responseData.data.tracking
          : [];

        setShipping(shipping);
        setTracking(tracking);
        const totalItems = responseData.data.count;
        setTotalPages(Math.ceil(totalItems / pageSize));
        setError(null);
      } catch (error) {
        console.error("Error fetching shipping:", error);
        setError("Failed to load shipping. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filterBy, filterWith, page, pageSize, startDate, endDate, search]);

  useEffect(() => {
    const sortedOrders = [...shippings].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    if (JSON.stringify(sortedOrders) !== JSON.stringify(shippings)) {
      setShipping(sortedOrders);
    }
  }, [shippings, sortOrder]);

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
          className={`h-10 w-10 rounded-full ${page === i ? "bg-[#B69B7C]/[12%] text-[#C1AE94]" : "bg-white text-[#C1AE94]"}`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  const handleOrderClick = (orderId: string) => {
    try {
      router.push(`/dashboard/orders/${orderId}`);
    } catch (error) {
      console.error("Error navigating to product detail:", error);
    }
  };

  return (
    <main className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-domaine text-[20px] text-[#252525]">All Orders</h2>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="relative w-[30%]">
          <input
            type="text"
            placeholder="Search . . ."
            value={search}
            onChange={handleSearchChange}
            className="w-full appearance-none rounded-md border-[1px] border-gray-200 bg-[white]/[1%] px-4 py-2.5 pl-10 font-josefins font-thin text-[#231F20] outline-none focus:border-[1px] focus:border-[#CDB698]"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transform">
            <Image
              src={Assets.IconSearch}
              alt="Search"
              style={{ width: "20px", height: "20px" }}
            />
          </div>
        </div>
        <div className="relative w-full items-center lg:w-[40%]">
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
      </div>
      <div className="relative h-full w-full overflow-hidden">
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
                onClick={() => handleTabSelection(tab)}
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

          {/* isi select tab nya */}
          <div className="relative mt-2 h-[50vh] overflow-y-auto rounded-[4px]">
            {loading ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <div>
                  <svg
                    aria-hidden="true"
                    className="h-12 w-12 animate-spin fill-[#C1AE94] text-gray-100"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-100"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
                <div className="font-josefins text-[18px] text-[#252525]">
                  Loading...
                </div>
              </div>
            ) : error ? (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-red-500">{error}</span>
              </div>
            ) : shippings.length > 0 ? (
              shippings.map((shipping, index) => {
                const relatedTracking = tracking.find(
                  (item) => item.orderId === shipping.orderId,
                );

                return (
                  <div
                    key={index}
                    className="my-2 flex w-full items-center justify-between rounded-md border border-gray-50 bg-white px-4 py-4 shadow"
                  >
                    <div className="flex w-full flex-col">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-domaine text-sm font-semibold text-[#252525]">
                            {shipping.transaction[0]?.products?.name ||
                              "Product Name Unavailable"}
                          </span>
                          <span className="text-sm font-light text-gray-400">
                            |
                          </span>
                          <span className="font-domaine text-sm font-light text-[#252525]">
                            {moment(shipping.updatedAt).isValid()
                              ? moment(shipping.updatedAt).format(
                                  "dddd, DD MMMM YYYY",
                                )
                              : "Date Unavailable"}
                          </span>
                          <span className="text-sm font-light text-gray-400">
                            |
                          </span>
                          {(role === $Enums.Role.LOGISTIC ||
                            role === $Enums.Role.ADMIN) && (
                            <>
                              {relatedTracking?.trackingLink ? (
                                <a
                                  href={relatedTracking.trackingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="appearance-none rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-4 py-1 font-domaine text-sm font-light text-white outline-none hover:text-white hover:no-underline focus:outline-none"
                                >
                                  Tracking {relatedTracking.orderId}
                                </a>
                              ) : (
                                <div className="text-sm text-red-500">
                                  Tracking link not available
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-domaine text-sm text-[#252525]">
                            Order ID
                          </span>
                          <span>:</span>
                          <span className="font-domaine text-sm text-[#252525]">
                            {shipping.orderId || "Order ID Unavailable"}
                          </span>
                        </div>
                      </div>
                      <hr className="my-2 border border-dashed border-gray-200" />
                      <div className="flex items-start justify-between gap-4 py-4">
                        <div className="flex w-[100%] flex-col gap-2">
                          <span className="text-sm font-bold text-gray-500">
                            Items
                          </span>
                          <div className="flex gap-2">
                            <div className="relative h-24 w-24 overflow-hidden rounded">
                              <Image
                                src={
                                  shipping.transaction[0]?.products?.image1 ||
                                  "/placeholder-image.png"
                                }
                                width={100}
                                height={100}
                                objectFit="cover"
                                alt={
                                  shipping.transaction[0]?.products?.name ||
                                  "Product Image"
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-base font-bold">
                                {shipping.transaction[0]?.products?.name ||
                                  "Product Name Unavailable"}
                              </span>
                              <div className="flex items-center gap-2">
                                <span>
                                  Rp {shipping.amount?.toLocaleString() || "0"}
                                </span>
                                <span>x</span>
                                <span>
                                  {shipping.transaction[0]?.quantity || "0"}{" "}
                                  Items
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex w-[70%] flex-col gap-2">
                          <span className="text-sm font-bold text-gray-500">
                            Address
                          </span>
                          <span className="text-base font-bold">
                            {shipping.user?.address || "Address Unavailable"}
                          </span>
                        </div>
                        <div className="flex w-[50%] flex-col items-end justify-end gap-1">
                          <span className="text-sm font-bold text-gray-500">
                            Total Belanja
                          </span>
                          <span className="text-sm font-bold">
                            Rp {shipping.amount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOrderClick(shipping.orderId)}
                          className="text-sm font-semibold text-gray-500 outline-none"
                        >
                          Lihat Detail Orders
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <Image
                  src={Assets.NoData}
                  alt="No Data"
                  width={200}
                  height={200}
                />
                <div className="font-domaine text-[18px] text-[#B69B78]">
                  No Orders Found
                </div>
              </div>
            )}
          </div>
        </div>
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
