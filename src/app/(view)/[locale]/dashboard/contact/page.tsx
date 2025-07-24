"use client";

import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";
import { GetListContactAdmin } from "@/controller/admin/contact";
import moment from "moment";
import { Assets } from "@/assets";
import Image from "next/image";

export default function Contact() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await GetListContactAdmin(1, 10);
        const data = await response.json();

        if (data && data.data) {
          setContacts(data.data);
          console.log(data.data, "asdsadas");
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

  const handleAddContact = () => {
    router.push("/dashboard/contact/create");
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
        <h2 className="font-domaine text-[20px] text-[#252525]">All Contact</h2>
        <div className="flex items-center gap-2">
          <ButtonPrimary
            width="w-[9.5rem]"
            height="h-[2.5rem]"
            text="Add Contact"
            onClick={handleAddContact}
          />
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-100 overflow-auto">
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
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Category
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Title
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {contact.id}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {moment(contact.createdAt).format("DD MMMM YYYY, HH:mm:ss")}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {contact.email}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {contact.category}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {contact.title}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-blue-500">
                  <button
                    className="text-[#B69B7C]"
                    onClick={() =>
                      router.push(`/dashboard/contact/${contact.id}`)
                    }
                  >
                    <Image
                      src={Assets.IconEye}
                      alt="View"
                      width={20}
                      height={20}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
