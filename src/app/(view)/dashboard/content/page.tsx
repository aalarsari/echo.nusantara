"use client";

import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Banner } from "@/types/Banner/Banner";
import { DeleteBanner, ListBanner } from "@/controller/admin/banner";
import { Assets } from "@/assets";
import Image from "next/image";

export default function Content() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { control } = useForm();

  const handleAddBanner = () => {
    router.push("/dashboard/content/create");
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await ListBanner();
        const result = await response.json();
        const banner = result.data;
        console.log(banner, "banner");
        setBanners(banner);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) {
      alert("Invalid banner ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this banner?",
    );

    if (confirmed) {
      const bannerToDelete = banners.find((banner) => banner.id === id);
      if (!bannerToDelete) {
        alert("Banner not found");
        return;
      }

      try {
        const response = await DeleteBanner(bannerToDelete);
        if (response.ok) {
          setBanners(banners.filter((banner) => banner.id !== id));
          router.push("/dashboard/content");
        } else {
          alert("Failed to delete banner");
        }
      } catch (error) {
        alert("An error occurred while deleting the banner");
      }
    }
  };

  return (
    <main className="relative flex h-full w-full flex-col gap-2 overflow-y-scroll">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-domaine text-[20px] text-[#252525]">All Banner</h2>
        <div className="flex items-center gap-2">
          <ButtonPrimary
            width="w-[9.5rem]"
            height="h-[2.5rem]"
            text="Add Banner"
            onClick={handleAddBanner}
          />
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-[#B69B7C]/[12%]">
            <tr>
              <th className="px-2 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                No
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Name
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Detail
              </th>
              {/* <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Status
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-2 py-4 text-center text-sm text-gray-900">
                  {banners.indexOf(banner) + 1}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {banner.title}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-blue-500">
                  <button
                    className="text-[#B69B7C]"
                    onClick={() =>
                      router.push(`/dashboard/content/${banner.id}`)
                    }
                  >
                    <Image
                      src={Assets.IconEye}
                      alt="View"
                      width={20}
                      height={20}
                    />
                  </button>
                  <button
                    className="ml-4 text-[#B69B7C]"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Image
                      src={Assets.IconTrash}
                      alt="Delete"
                      width={20}
                      height={20}
                    />
                  </button>
                </td>
                {/* <td className="px-6 py-4 text-center text-sm text-gray-900">
                  <Controller
                    control={control}
                    name={"isActive"}
                    defaultValue={banner.is}
                    render={({ field: { onChange, value } }) => (
                      <input
                        type="checkbox"
                        checked={value}
                        className="h-5 w-5 accent-[#C1AE94]"
                        onChange={async () => {
                          const newValue = !value;
                          onChange(newValue);
                          await handleStatusChange(socialItem.id!, newValue);
                        }}
                      />
                    )}
                  />
                </td> */}
                {/* <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {banner.category}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
