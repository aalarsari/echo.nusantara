"use client";

import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";

import moment from "moment";
import { GetListsubScribeAdmin } from "@/controller/admin/subscribe";
import { useRouter } from "next/navigation";

export default function Subscriber() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await GetListsubScribeAdmin(1, 10);
        const data = await response.json();

        if (data && data.data) {
          setSubscribers(data.data);
        } else {
          setError("No contacts found");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contacts");
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleAddSubscriber = () => {
    router.push("/dashboard/subscriber/create");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="flex h-full w-full flex-col gap-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-domaine text-[20px] text-[#252525]">
          All Subscriber
        </h2>
        <div className="flex items-center gap-2">
          <ButtonPrimary
            width="w-[10rem]"
            height="h-[2.5rem]"
            text="Add Subscriber"
            onClick={handleAddSubscriber}
          />
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-[#B69B7C]/[12%]">
            <tr>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                No
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Date
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {subscriber.id}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {moment(subscriber.createdAt).format(
                    "DD MMMM YYYY, HH:mm:ss",
                  )}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {subscriber.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
