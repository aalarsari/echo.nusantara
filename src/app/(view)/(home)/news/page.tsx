"use client";

import { Assets } from "@/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GetBlog } from "@/controller/noAuth/blog";
import moment from "moment";
import { blog } from "@/types/blog/blog";
import { useRouter } from "next/navigation";

export default function News() {
  const [news, setNewsData] = useState<{
    blog: blog[];
    lastNews: any | null;
    topBlog: blog[];
  }>({
    blog: [],
    lastNews: null,
    topBlog: [],
  });
  const [pageSize, setPageSize] = useState<number>(6);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

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

  const handleLastNewsClick = (slug: string) => {
    try {
      router.push(`/news/article/${slug}`);
    } catch (error) {
      console.error("Error navigating to product detail:", error);
    }
  };

  const handleBlogClick = (slug: string) => {
    try {
      router.push(`/news/article/${slug}`);
    } catch (error) {
      console.error("Error navigating to product detail:", error);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="w-full flex items-center justify-center py-16 lg:py-24">
        <h1 className="text-[52px] font-thin text-black font-domaine text-center">
          Our News & Updates
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full h-screen items-center flex-col lg:flex-row gap-2 justify-center bg-[#F4F4F4] lg:py-10 lg:px-10">
          <div className="w-full h-[656px]">
            {news.lastNews ? (
              <div
                onClick={() => handleLastNewsClick(news.lastNews.slug)}
                className="w-full h-full"
              >
                <div
                  style={{ position: "relative" }}
                  className="flex h-full w-full justify-center overflow-hidden lg:rounded-[10px]"
                >
                  {/* Gambar */}
                  <Image
                    src={news.lastNews.image[0] || Assets.DefaultImage}
                    alt="Last News"
                    fill
                    priority
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-black/0 z-[10]" />
                  <div className="absolute inset-0 z-20 py-10 px-4 ">
                    <div className="flex flex-col justify-end items-end relative gap-8 h-full w-full px-4">
                      <div className="w-full">
                        <div className="flex flex-col gap-1">
                          <span className="font-domaine uppercase text-[14px] font-light text-white text-left">
                            {news.lastNews.category ?? "No Category"}
                          </span>
                          <h2 className="font-domaine text-[24px] font-semibold text-white text-left">
                            {news.lastNews.title}
                          </h2>
                        </div>
                        <span className="font-domaine text-[16px] text-white text-left">
                          {news.lastNews.subtitle}
                        </span>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <div className="flex flex-row gap-2 justify-center items-center">
                          <Image
                            src={Assets.TimeWhite}
                            alt="Time"
                            width={16}
                            height={16}
                          />
                          <span className="font-domaine text-[14px] font-light text-white">
                            {moment(news.lastNews.createdAt).format(
                              "DD MMMM YYYY"
                            )}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleLastNewsClick(news.lastNews.slug)
                          }
                          className="font-domaine text-[14px] rounded-full px-4 py-1 font-semibold bg-white text-[#B69B7C] ring-1 ring-[#7D716A]"
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 lg:rounded-[10px] animate-pulse">
                <span className="text-gray-500 text-sm">
                  Loading latest news...
                </span>
              </div>
            )}
          </div>

          <div className="relative w-full h-[656px] overflow-y-scroll">
            {news.topBlog && news.topBlog.length > 0 ? (
              news.topBlog.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleBlogClick(item.slug)}
                  className="flex flex-col gap-4 py-2 px-4"
                >
                  <div className="h-[225px] relative overflow-hidden bg-white w-full cursor-pointer shadow-product rounded-[16px] shadow-gray-100">
                    <div className="flex h-full w-full flex-row gap-2">
                      <div className="relative h-full w-[225px]">
                        <Image
                          src={item.image[0] || Assets.DefaultImage}
                          fill
                          style={{ objectFit: "cover" }}
                          priority={true}
                          alt={`Top Blog ${index + 1}`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-start gap-8 h-full w-[60%] px-4 relative overflow-hidden">
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
                          <div className="flex flex-row gap-2 items-center justify-center">
                            <Image
                              src={Assets.TimeBronze}
                              alt="Last News"
                              width={16}
                              height={16}
                            />
                            <span className="font-domaine text-[14px] font-light text-black">
                              {moment(item.updateAt).format("DD MMMM YYYY")}
                            </span>
                          </div>
                          <button
                            onClick={() => handleBlogClick(item.slug)}
                            className="font-domaine text-[14px] rounded-full px-4 py-1 font-semibold text-[#B69B7C] ring-1 ring-[#7D716A]"
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 lg:rounded-[10px] animate-pulse">
                <span className="text-gray-500 text-sm">
                  Loading News . . .
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
