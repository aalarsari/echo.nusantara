"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import { ListTransaction } from "@/controller/admin/transaction";

export default function Transactions() {
   const router = useRouter();
   const [payments, setPayments] = useState<Payment[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [notification, setNotification] = useState({
      message: "",
      type: "success" as "success" | "error",
      visible: false,
   });

   const showNotification = (message: string, type: "success" | "error", duration: number = 3000) => {
      setNotification({ message, type, visible: true });
      setTimeout(() => {
         setNotification({ message: "", type, visible: false });
      }, duration);
   };

   const [filterBy, setFilterBy] = useState<string>("status");
   const [filterWith, setFilterWith] = useState<string>("PAID");
   const [page, setPage] = useState<number>(1);
   const [pageSize, setPageSize] = useState<number>(10);

   const [startDate, setStartDate] = useState<string>(moment().startOf("year").format("YYYY-MM-DD"));
   const [endDate, setEndDate] = useState<string>(moment().endOf("day").format("YYYY-MM-DD"));

   useEffect(() => {
      const fetchContacts = async () => {
         try {
            const response = await ListTransaction({
               filterBy,
               filterWith,
               startDate,
               endDate,
               page,
               pageSize,
            });
            const data = await response.json();
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

      fetchContacts();
   }, [filterBy, filterWith, page, pageSize, startDate, endDate]);

   return (
      <main className="flex h-full w-full flex-col gap-2">
         <div className="mb-2 flex items-center justify-between">
            <h2 className="font-domaine text-[20px] text-[#252525]">All Payment</h2>
         </div>
         <div className="flex-grow overflow-auto">
            <table className="min-w-full divide-y divide-gray-100">
               <thead className="bg-[#B69B7C]/[12%]">
                  <tr>
                     <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">No</th>
                     <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">Date</th>
                     <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-300 bg-white">
                  {payments.map((payment, index) => (
                     <tr key={payment.id}>
                        <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">{index + 1}</td>
                        <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                           {moment(payment.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                        </td>
                        <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                           {payment.transaction[0].status}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </main>
   );
}
