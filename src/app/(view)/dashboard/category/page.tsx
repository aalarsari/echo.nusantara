"use client";

import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";
import { GetCategory } from "@/controller/admin/category";
import { Controller, useForm } from "react-hook-form";

export default function Category() {
  const router = useRouter();
  const [categorys, setCategorys] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { control } = useForm();

  const handleAddCategory = () => {
    router.push("/dashboard/category/create");
  };

  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const response = await GetCategory();
        const result = await response.json();
        const category = result.data;
        setCategorys(category);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchCategorys();
  }, []);

  return (
    <main className="flex h-full w-full flex-col gap-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-domaine text-[20px] text-[#252525]">
          All Category
        </h2>
        <div className="flex items-center gap-2">
          <ButtonPrimary
            width="w-[9.5rem]"
            height="h-[2.5rem]"
            text="Add Category"
            onClick={handleAddCategory}
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
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Name
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {categorys.map((category) => (
              <tr key={category.id}>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {category.id}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-900">
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field: { onChange, value } }) => (
                      <input
                        type="checkbox"
                        checked={value}
                        className="h-5 w-5 accent-[#C1AE94]"
                        // onChange={async () => {
                        //   const newValue = !value;
                        //   onChange(newValue);
                        //   await handleStatusChange(socialItem.id!, newValue);
                        // }}
                      />
                    )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
