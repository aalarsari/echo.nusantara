"use client";

import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";
import { Assets } from "@/assets";
import Image from "next/image";
import moment from "moment";
import { DeleteBlog, GetBlog } from "@/controller/admin/blog";
import { blog } from "@/types/blog/blog";

export default function News() {
  const router = useRouter();
  const [news, setNews] = useState<blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleAddCreate = () => {
    router.push("/dashboard/news/create");
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await GetBlog(page, pageSize, searchQuery);
        const result = await response.json();

        if (result && Array.isArray(result.data.blog)) {
          setNews(result.data.blog);
          setTotalPages(Math.ceil(result.data.count / pageSize));
        } else {
          setError("Invalid data format");
        }
      } catch (err) {
        setError("Failed to fetch news");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, pageSize, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleDelete = async (slug: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this news?",
    );
    if (confirmed) {
      try {
        const response = await DeleteBlog(slug);
        if (response.ok) {
          setNews(news.filter((news) => news.slug !== slug));
        } else {
          alert("Failed to delete news");
        }
      } catch (error) {
        alert("An error occurred while deleting the news");
      }
    }
  };

  return (
    <main className="flex h-full w-full flex-col gap-2">
      <div className="mb-2 flex w-full items-center justify-between">
        <div className="w-full">
          <h2 className="font-domaine text-[20px] text-[#252525]">All News</h2>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search . . . "
              value={searchQuery}
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
          <ButtonPrimary
            width="w-[48%]"
            height="h-[2.8rem]"
            text="Add News"
            onClick={handleAddCreate}
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
                Title
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Subtitle
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Create at
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {news.length > 0 ? (
              news.map((blog, i) => (
                <tr key={blog.title}>
                  <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                    {(page - 1) * pageSize + i + 1}
                  </td>
                  <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                    {blog.title}
                  </td>
                  <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                    {blog.subtitle}
                  </td>
                  <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                    {moment(blog.updateAt).format("DD MMM YYYY")}
                  </td>
                  <td className="flex flex-row justify-center gap-6 px-6 py-4 text-center text-sm font-medium">
                    <button
                      className="text-[#B69B7C]"
                      onClick={() =>
                        router.push(`/dashboard/news/${blog.slug}`)
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
                      onClick={() => handleDelete(news[0].slug)}
                      className="text-[#B69B7C]"
                    >
                      <Image
                        src={Assets.IconTrash}
                        alt="Delete"
                        width={20}
                        height={20}
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No news available
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
