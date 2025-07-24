"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { GetDataDashboard } from "@/controller/admin/dashboard";
import { FormatRupiah } from "@/components";
import { useSession } from "next-auth/react";
import {
  grafikEnum,
  topSallerEnum,
  topSellerValidation,
} from "@/lib/zod-schema/dashboard";
import { Listbox } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { DashboardModel } from "@/types/dashboard/dashboard";
import moment from "moment-timezone";
import { $Enums } from "@prisma/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Dashboard() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [dataP, setData] = useState<DashboardModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isGrafikDropdownOpen, setIsGrafikDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [startDate, setStartDate] = useState<string>(
    moment(`${new Date().getFullYear() - 1}-01-01`).format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(
    moment(`${new Date().getFullYear()}-12-31`).format("YYYY-MM-DD"),
  );

  const years = Array.from({ length: 5 }, (_, i) => 2024 + i);

  const [selectedRange, setSelectedRange] = useState<topSallerEnum>("year");
  const ranges = [
    { label: "Day", value: "day" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];

  const [selectedGrafik, setSelectedGrafik] = useState<grafikEnum>("Revenue");
  const grafic = [
    { label: "Revenue", value: "Revenue" },
    { label: "Total Orders", value: "Total Orders" },
    { label: "Total Customers", value: "Total Customers" },
    { label: "Items Sold", value: "Items Sold" },
  ];

  const { control } = useForm({
    resolver: zodResolver(topSellerValidation),
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await GetDataDashboard({
          topSeller: selectedRange,
          grafik: selectedGrafik,
          year: selectedYear,
        });
        if (response.ok) {
          const json = await response.json();
          setData(json.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedRange, selectedGrafik, selectedYear]);
  const handleGrafikChange = (value: grafikEnum) => {
    setSelectedGrafik(value);
  };

  const chartData = {
    labels: months,
    datasets: [
      {
        label: selectedGrafik,
        data:
          loading || !dataP || !dataP.cartModel || dataP.cartModel.length === 0
            ? new Array(12).fill(0)
            : months.map((month, index) => {
                const found = dataP.cartModel.find(
                  (item: any) => item.mounth === index + 1,
                );
                return found ? found.total : 0;
              }),
        backgroundColor: ["rgba(234, 212, 184, 0.7)"],
        borderColor: ["#B69B7C"],
        borderWidth: 0.5,
        borderRadius: 4,
      },
    ],
  };

  return (
    <main className="relative flex h-full w-full flex-col overflow-auto">
      <div className="relative flex min-h-[20%] w-full flex-row justify-between gap-4 overflow-x-auto overflow-y-hidden py-2 lg:h-[20vh]">
        {(role === $Enums.Role.SALES || role === $Enums.Role.ADMIN) && (
          <div className="flex h-[14vh] w-full flex-shrink-0 flex-col gap-2 rounded-[8px] bg-white px-4 py-2 shadow-md shadow-[#000000]/[10%] lg:flex-shrink ">
            <div className="flex flex-row gap-2">
              <Image
                src={Assets.IconRevenue}
                width={24}
                height={24}
                alt="Logo Revenue"
              />
              <span className="font-domaine text-[18px] font-semibold text-[#999999]">
                Total Revenue
              </span>
            </div>
            <div>
              <span className="font-josefins text-[24px] text-[#231F20]">
                <FormatRupiah price={dataP?.totalRevanue ?? 0} />
              </span>
            </div>
          </div>
        )}

        {(role === $Enums.Role.LOGISTIC || role === $Enums.Role.ADMIN) && (
          <div className="flex h-[14vh] w-full flex-shrink-0 flex-col gap-2 rounded-[8px] bg-white px-4 py-2 shadow-md shadow-[#000000]/[10%] lg:flex-shrink">
            <div className="flex flex-row gap-2">
              <Image
                src={Assets.IconOrder}
                width={24}
                height={24}
                alt="Logo Order"
              />
              <span className="font-domaine text-[18px] font-semibold text-[#999999]">
                Total Orders
              </span>
            </div>
            <div>
              <span className="font-josefins text-[24px] text-[#231F20]">
                {loading ? "Loading..." : (dataP?.totalOrder ?? "0")}
              </span>
            </div>
          </div>
        )}

        {(role === $Enums.Role.SALES || role === $Enums.Role.ADMIN) && (
          <div className="flex h-[14vh] w-full flex-shrink-0 flex-col gap-2 rounded-[8px] bg-white px-4 py-2 shadow-md shadow-[#000000]/[10%] lg:flex-shrink">
            <div className="flex flex-row gap-2">
              <Image
                src={Assets.IconCustomer}
                width={24}
                height={24}
                alt="Logo Customers"
              />
              <span className="font-domaine text-[18px] font-semibold text-[#999999]">
                Total Customers
              </span>
            </div>
            <div>
              <span className="font-josefins text-[24px] text-[#231F20]">
                {loading ? "Loading..." : (dataP?.totalCostumer ?? "0")}
              </span>
            </div>
          </div>
        )}

        {(role === $Enums.Role.LOGISTIC || role === $Enums.Role.ADMIN) && (
          <div className="flex h-[14vh] w-full flex-shrink-0 flex-col gap-2 rounded-[8px] bg-white px-4 py-2 shadow-md shadow-[#000000]/[10%] lg:flex-shrink">
            <div className="flex flex-row gap-2">
              <Image
                src={Assets.IconItem}
                width={24}
                height={24}
                alt="Logo Item"
              />
              <span className="font-domaine text-[18px] font-semibold text-[#999999]">
                Items Sold
              </span>
            </div>
            <div>
              <span className="font-josefins text-[24px] text-[#231F20]">
                {loading ? "Loading..." : (dataP?.totalItemSold ?? "0")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-full w-full flex-col-reverse justify-start md:justify-between lg:flex-row">
        <div className="flex h-full w-full flex-col gap-2">
          <div className="flex flex-row gap-2">
            <div className="relative">
              <button
                className="inline-flex h-10 items-center justify-between rounded-md border border-[#B69B7C] bg-white px-4 font-domaine text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsGrafikDropdownOpen(!isGrafikDropdownOpen)}
              >
                {selectedGrafik !== null ? selectedGrafik : "Select Grafik"}
                <svg
                  className="-mr-1 ml-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isGrafikDropdownOpen && (
                <div className="absolute z-10 mt-2 w-36 rounded-md bg-white shadow-lg">
                  <ul
                    className="py-1 font-domaine text-sm text-gray-700"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {grafic.map((item) => (
                      <li
                        key={item.value}
                        className="cursor-pointer px-4 py-2 font-domaine hover:bg-gray-100"
                        onClick={() => {
                          handleGrafikChange(item.value as grafikEnum);
                          setIsGrafikDropdownOpen(false);
                        }}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="inline-flex h-10 items-center justify-between rounded-md border border-[#B69B7C] bg-white px-4 font-domaine text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              >
                {selectedYear !== null ? selectedYear : "Select a Year"}
                <svg
                  className="-mr-1 ml-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isYearDropdownOpen && (
                <div className="absolute z-10 mt-2 rounded-md bg-white px-2 shadow-lg">
                  <ul
                    className="py-1 text-sm text-gray-700"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {years.map((year) => (
                      <li
                        key={year}
                        className="cursor-pointer px-4 py-2 font-domaine hover:bg-gray-100"
                        onClick={() => {
                          setSelectedYear(year);
                          setStartDate(
                            moment(`${year}-01-01`).format("YYYY-MM-DD"),
                          );
                          setEndDate(
                            moment(`${year}-12-31`).format("YYYY-MM-DD"),
                          );
                          setIsYearDropdownOpen(false);
                        }}
                      >
                        {year}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="h-full w-full lg:h-[64vh] lg:w-[95%]">
            <Bar
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: true,
                      color: "#F1F1F1F1",
                    },
                    ticks: {
                      color: "#666666",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <>
          <div
            className={`w-full p-2 lg:w-[25%] ${dataP?.topSaller?.length === 1 ? "h-auto" : "h-auto"}`}
          >
            <div className="w-full rounded-[8px] p-4 shadow-md shadow-[#000000]/[10%]">
              <div className="flex w-full items-center justify-between">
                <span className="w-full bg-white font-domaine text-[18px] font-semibold text-[#231F20]">
                  Top Seller
                </span>
                <Controller
                  control={control}
                  name="role"
                  rules={{ required: "Please select an option" }}
                  render={({ field }) => (
                    <Listbox value={selectedRange} onChange={setSelectedRange}>
                      {({ open }) => (
                        <div className="relative w-40">
                          <Listbox.Button className="flex w-full cursor-pointer items-center justify-between rounded-[4px] bg-white bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-3 py-[5px] text-left font-domaine text-white sm:text-sm">
                            {
                              ranges.find(
                                (range) => range.value === selectedRange,
                              )?.label
                            }
                            <ChevronDownIcon
                              className={`h-5 w-5 transform text-white transition-all duration-300 ${open ? "rotate-180" : ""}`}
                              aria-hidden="true"
                            />
                          </Listbox.Button>
                          <Listbox.Options className="absolute mt-1 w-full rounded-[4px] bg-white shadow-md">
                            {ranges.map((range) => (
                              <Listbox.Option
                                key={range.value}
                                value={range.value}
                                className={({ active }) =>
                                  `cursor-pointer px-4 py-2 font-domaine text-sm ${
                                    active
                                      ? "bg-gradient-to-t from-[#B69B78] to-[#CDB698] text-white"
                                      : "text-gray-700"
                                  }`
                                }
                              >
                                {range.label}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      )}
                    </Listbox>
                  )}
                />
              </div>
              <div className="mt-6">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="flex w-full flex-col gap-2">
                    {dataP?.topSaller?.map(
                      (
                        seller: {
                          products: {
                            image1: any;
                            name: any;
                            priceIDR: any;
                          };
                          quantity: any;
                        },
                        index: React.Key | null | undefined,
                      ) => (
                        <div key={index} className="flex h-full w-full gap-2">
                          <div className="relative overflow-hidden lg:h-[40%] lg:w-[40%]">
                            <Image
                              src={seller.products.image1 ?? ""}
                              alt={seller.products.name ?? "Product Image"}
                              width={100}
                              height={100}
                              objectFit="contain"
                              className="rounded-[4px]"
                            />
                          </div>
                          <div className="flex h-auto w-[60%] flex-col items-start justify-between">
                            <div className="flex flex-col">
                              <span className="font-domaine text-[12px] font-semibold text-[#231F20]">
                                {seller.products.name ?? "No Data"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-domaine text-[12px] text-[#666666]">
                                <FormatRupiah
                                  price={seller.products.priceIDR ?? 0}
                                />
                              </span>
                              <span className="font-domaine text-[12px] text-[#666666]">
                                Quantity Sold : {seller.quantity ?? 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </main>
  );
}
