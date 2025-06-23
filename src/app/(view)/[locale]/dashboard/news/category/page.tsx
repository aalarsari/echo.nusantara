"use client";

import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { GetCategoryBlog, UpdateCategoryBlog } from "@/controller/admin/blog";
import { CategoryBlog } from "@prisma/client";

export default function Category() {
  const router = useRouter();
  const [categoryBlog, setCatgoryBlog] = useState<CategoryBlog[]>([]);
  const { control } = useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchCategoryBlog = async () => {
      try {
        const response = await GetCategoryBlog(page, pageSize);
        const result = await response.json();

        const { category, countCategoty } = result.data;

        setCatgoryBlog(category || []);
        setTotalPages(Math.ceil((countCategoty || 0) / pageSize));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categoryBlog media");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBlog();
  }, [page, pageSize]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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

  const handleStatusChange = async (id: number, isRecomended: boolean) => {
    try {
      await UpdateCategoryBlog({ id });
      setCatgoryBlog((prevCategoryBlog) =>
        prevCategoryBlog.map((item) =>
          item.id === id ? { ...item, isRecomended: !isRecomended } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update social media status");
    }
  };

  return (
    <main className="flex h-full w-full flex-col gap-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-domaine text-[20px] text-[#252525]">
          All Category News
        </h2>
        <div className="flex items-center gap-2">
          <ButtonPrimary
            width="w-[12rem]"
            height="h-[2.5rem]"
            text="Add News"
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
                Name
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {categoryBlog && categoryBlog.length > 0 ? (
              categoryBlog.map((categoryItem, index) => (
                <tr key={categoryItem.id}>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {categoryItem.name}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    <Controller
                      control={control}
                      name={`${categoryItem.id}`}
                      defaultValue={categoryItem.isRecomended}
                      render={({ field: { onChange, value } }) => (
                        <input
                          type="checkbox"
                          checked={value}
                          className="h-5 w-5 accent-[#C1AE94]"
                          onChange={async () => {
                            const newValue = !value;
                            onChange(newValue);
                            await handleStatusChange(
                              categoryItem.id!,
                              newValue,
                            );
                          }}
                        />
                      )}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No categoryBlog media data available
                </td>
              </tr>
            )}
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
