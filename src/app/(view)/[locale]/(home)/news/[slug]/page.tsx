"use client";

import { GetBlog, GetDetailBlog } from "@/controller/noAuth/blog";
import { Blog } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import moment from "moment";
import { useRouter } from "next/navigation";
import { blog } from "@/types/blog/blog";

export default function DetailNewsComponent({
  params,
}: {
  params: { slug: string };
}) {
  const [blogDetail, setBlogDetail] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [news, setNewsData] = useState<{
    blog: blog[];
  }>({
    blog: [],
  });
  const [pageSize, setPageSize] = useState<number>(6);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [blogData, setBlogData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(
    "Filter Your News & Updates"
  );
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchDetailShop = async (slug: string) => {
      try {
        const res = await GetDetailBlog(params.slug);
        const body = await res.json();
        setBlogDetail(body.data);
      } catch (error) {
        setError("Error fetching product detail");
      }
    };
    fetchDetailShop(params.slug);
    return () => {};
  }, [params.slug]);

  useEffect(() => {
    const fetchDataBlog = async () => {
      try {
        const response = await GetBlog(page, pageSize);
        if (response.ok) {
          const result = await response.json();
          setNewsData(result?.data);
          console.log(result?.data, "dasda fadata");
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataBlog();
  }, [page, pageSize]);

  useEffect(() => {
    const fetchBlog = async () => {
      const orderBy = selectedOption === "Newest" ? "desc" : "asc";
      try {
        const res = await GetBlog(page, limit, orderBy);
        const json = await res.json();
        setBlogData(json?.data || []);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };

    fetchBlog();
  }, [selectedOption, page, limit]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setPage(1);
    setIsOpen(false);
    console.log("Selected option:", option);
  };

  return (
    <>
      {blogDetail && (
        <div className="h-full w-full px-8">
          <div className="relative mx-auto my-24 flex h-full w-full flex-col items-center justify-start gap-8 overflow-y-auto">
            <div className="flex w-full flex-col items-start justify-start gap-4">
              <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                  <div className="px-4 py-1 bg-[#393939] rounded-[4px]">
                    <p className="text-white text-[18px] uppercase">
                      {blogDetail.id || "Category"}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <Image
                      src={Assets.TimeBrown}
                      alt="time-brown"
                      width={16}
                      height={16}
                    />
                    <span className="font-domaine text-[14px] font-light text-black">
                      {moment(blogDetail.updateAt).format("DD MMMM YYYY")}
                    </span>
                  </div>
                </div>
                <h2 className="text-left font-domaine text-[22px] font-semibold lg:text-[32px]">
                  {blogDetail.title}
                </h2>
              </div>
            </div>
            <div
              style={{ position: "relative" }}
              className="h-[676px] w-full overflow-hidden rounded-[8px]"
            >
              <Image
                src={blogDetail.image[0] || Assets.DefaultImage}
                alt={blogDetail.title}
                fill
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                // className="object-cover"
              />
            </div>
            <div className="flex w-full items-center justify-center">
              <div
                className="blog-content w-full font-josefins text-[16px] font-light text-[#252525]"
                dangerouslySetInnerHTML={{
                  __html: blogDetail.content || "",
                }}
              />
            </div>
            <div className="relative flex w-full px-4 py-10 lg:p-10 flex-col gap-4">
              <div className="flex w-full flex-col gap-2 lg:flex-row justify-center lg:justify-between items-center lg:items-start">
                <h1 className="text-[52px] font-thin text-black font-domaine text-center">
                  Other Post
                </h1>

                <div className="relative inline-block text-left w-[280px]">
                  <div
                    onClick={() => {
                      setIsOpen(!isOpen);
                      console.log("Dropdown clicked");
                    }}
                    className="bg-white px-6 gap-2 h-[44px] relative border-[1px] border-[#7D716A] flex justify-between items-center rounded-full cursor-pointer"
                  >
                    <h1 className="text-[16px] font-thin text-[#7D716A] font-domaine text-center">
                      {selectedOption}
                    </h1>
                    <Image
                      src={Assets.ArrowDown}
                      alt="arrow-down"
                      width={16}
                      height={16}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {isOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-[#7D716A] rounded-lg shadow-lg">
                      <div
                        onClick={() => handleSelect("Newest")}
                        className="px-6 py-2 hover:bg-[#F5F5F5] cursor-pointer font-domaine text-[#7D716A]"
                      >
                        Newest
                      </div>
                      <div
                        onClick={() => handleSelect("Latest")}
                        className="px-6 py-2 hover:bg-[#F5F5F5] cursor-pointer font-domaine text-[#7D716A]"
                      >
                        Latest
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-4 py-4">
                {news.blog && news.blog.length > 0 ? (
                  news.blog.slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(`/news/${item.slug}`)}
                      className="h-[225px] relative overflow-hidden bg-white w-full cursor-pointer shadow-product rounded-[16px] shadow-gray-100"
                    >
                      <div className="flex h-full w-full flex-row gap-2">
                        <div className="relative h-full w-[225px]">
                          <Image
                            src={item.image?.[0] || Assets.DefaultImage}
                            fill
                            style={{ objectFit: "cover" }}
                            alt={`Top Blog ${index + 1}`}
                          />
                        </div>
                        <div className="flex flex-col justify-center items-start gap-8 h-full w-[60%] px-4">
                          <div className="w-full">
                            <div className="flex flex-col gap-1">
                              <span className="font-domaine uppercase text-[14px] font-light text-black">
                                {item.category?.name ?? "No Category"}
                              </span>
                              <h2 className="font-domaine text-[24px] font-semibold text-black truncate w-full">
                                {item.title}
                              </h2>
                            </div>
                            <h2 className="font-domaine text-[16px] font-normal text-black truncate w-[300px]">
                              {item.subtitle}
                            </h2>
                          </div>
                          <div className="w-full flex justify-between items-center">
                            <div className="flex flex-row gap-2 items-center">
                              <Image
                                src={Assets.TimeBronze}
                                alt="time-brown"
                                width={16}
                                height={16}
                              />
                              <span className="font-domaine text-[14px] font-light text-[#B69B7C]">
                                {moment(item.updateAt).format("DD MMMM YYYY")}
                              </span>
                            </div>
                            <button
                              onClick={() => router.push(`/news/${item.slug}`)}
                              className="font-domaine text-[14px] rounded-full px-4 py-1 font-semibold text-[#B69B7C] ring-1 ring-[#7D716A]"
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 col-span-full">
                    No blog posts found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
