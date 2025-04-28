"use client";

import { Assets } from "@/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GetBlog, GetCategoryBlog } from "@/controller/noAuth/blog";
import Carousel from "react-multi-carousel";
import {
  CustomArrowLeft,
  CustomArrowRight,
} from "@/components/atoms/ButtomCustom";
import moment from "moment";
import { blog } from "@/types/blog/blog";
import { useRouter } from "next/navigation";
import { CategoryBlog } from "@prisma/client";

export default function News() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [news, setNewsData] = useState<{
    blog: blog[];
    lastNews: any | null;
    category: Category[];
    topBlog: blog[];
  }>({
    blog: [],
    category: [],
    lastNews: null,
    topBlog: [],
  });
  const [categoryNews, setCategoryNews] = useState<CategoryBlog[]>([]);
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
    const fetchDataCategoryBlog = async () => {
      try {
        const response = await GetCategoryBlog();
        if (response.ok) {
          const result = await response.json();
          setCategoryNews(result?.data);
          console.log(result?.data, "Asdasdada");
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategoryBlog();
  }, []);

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

  const handleCategoryClick = (category: string) => {
    try {
      router.push(`/news/topics/${category}`);
    } catch (error) {
      console.error("Error navigating to product detail:", error);
    }
  };

  const colors = ["#A4AC86", "#D1D8BD", "#C7C2AB", "#FEFAE0"];
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="relative h-full w-full">
      {news.lastNews ? (
        <div
          onClick={() => handleLastNewsClick(news.lastNews.slug)}
          className="flex h-full cursor-pointer flex-col"
        >
          <div className="flex w-full flex-col items-center justify-center pt-20 lg:h-[80vh] lg:pt-16">
            <div className="flex w-full max-w-6xl flex-col-reverse items-center justify-center gap-4 lg:flex-col">
              <div
                style={{ position: "relative" }}
                className="flex h-[20vh] w-full justify-center overflow-hidden rounded-[10px] lg:h-[40vh]"
              >
                {news.lastNews.image[0] ? (
                  <Image
                    src={news.lastNews.image[0] || Assets.DefaultImage}
                    alt="Last News"
                    fill
                    priority
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-4 text-center">
                    <div>
                      <span className="text-center font-domaine text-[22px] lg:text-[32px]">
                        {news.lastNews.title}
                      </span>
                      <p className="text-center font-josefins text-[14px] font-thin lg:text-[20px]">
                        {news.lastNews.subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex w-full flex-col items-center px-4">
                <div className="flex h-full w-full items-center justify-center px-4 text-center">
                  <div>
                    <span className="text-center font-domaine text-[22px] font-semibold lg:text-[28px]">
                      {news.lastNews.title}
                    </span>
                    <p className="text-center text-[16px] font-thin lg:text-[22px]">
                      {news.lastNews.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full animate-pulse cursor-pointer flex-col">
          <div className="flex w-full flex-col items-center justify-center pt-20 lg:h-[80vh] lg:pt-16">
            <div className="flex w-full max-w-6xl flex-col-reverse items-center justify-center gap-4 lg:flex-col">
              <div
                style={{ position: "relative" }}
                className="flex h-[20vh] w-full justify-center overflow-hidden rounded-[10px] lg:h-[40vh]"
              >
                <div className="flex h-full w-full items-center justify-center px-4 text-center">
                  <div className="h-[70%] w-[70%] animate-pulse rounded-[10px] bg-gray-300" />
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-2 px-4">
                <div className="h-6 w-1/3 rounded bg-gray-300"></div>
                <div className="h-6 w-1/6 rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto h-full w-full max-w-6xl px-4 lg:py-8">
        <div className="flex flex-row items-center">
          <div className="h-[10px] w-[4px] rounded-sm bg-[#F81539]" />
          <div className="px-2">
            <span className="font-domaine text-[16px] font-semibold lg:text-[24px]">
              Popular Posts
            </span>
          </div>
        </div>

        {/* Popular Posts Carousel */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Carousel
            arrows={isHovered}
            responsive={responsive}
            infinite={true}
            containerClass="carousel-container h-[55vh]"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            itemClass="flex items-center justify-center w-full"
            customLeftArrow={
              <CustomArrowLeft onClick={() => null} isHovered={isHovered} />
            }
            customRightArrow={
              <CustomArrowRight onClick={() => null} isHovered={isHovered} />
            }
          >
            {news.topBlog && news.topBlog.length > 0 ? (
              news.topBlog.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleBlogClick(item.slug)}
                  className="flex h-[48vh] w-[80%] transform cursor-pointer flex-col justify-between gap-2 rounded-[8px] p-2 font-domaine shadow-md transition-all duration-300 hover:scale-105"
                >
                  <div>
                    <div
                      style={{ position: "relative" }}
                      className="h-[26vh] w-full overflow-hidden rounded-[6px]"
                    >
                      <Image
                        fill
                        src={item.image[0] || Assets.DefaultImage}
                        style={{ objectFit: "cover" }}
                        alt={`Top Blog ${index + 1}`}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="w-full">
                      <span className="truncate-line-clamp-1 text-[20px] font-semibold">
                        {item.title}
                      </span>
                    </div>
                    <div>
                      <p className="truncate-line-clamp-2 text-[16px]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full flex-row items-center justify-start gap-2 rounded-[6px]">
                    <div className="flex flex-col gap-1">
                      <div>
                        <span className="font-josefins text-[14px]">
                          {moment(item.updateAt).format("DD MMMM YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-[48vh] w-full transform cursor-pointer flex-col gap-2 px-4">
                <div
                  style={{ position: "relative" }}
                  className="h-[26vh] w-full overflow-hidden rounded-[6px] py-4"
                >
                  <div className="h-full w-full animate-pulse rounded-[10px] bg-gray-200" />
                </div>
                <div className="items-left flex w-full flex-col gap-2 ">
                  <div className="h-6 w-[40%] rounded bg-gray-200"></div>
                  <div className="h-6 w-[60%] rounded bg-gray-200"></div>
                </div>
              </div>
            )}
          </Carousel>
        </div>
      </div>
      <div className="mx-auto flex h-[100vh] w-full max-w-6xl flex-col-reverse lg:flex-row lg:py-4">
        <div className="custom-scroll flex h-full w-full flex-col gap-8 overflow-y-scroll p-4 lg:w-[60%]">
          {news.blog && news.blog.length > 0 ? (
            news.blog.map((item, index) => (
              <button
                aria-label="News Item"
                key={index}
                onClick={() => handleBlogClick(item.slug)}
              >
                <div className="flex h-[8rem] w-full items-center justify-between rounded-[8px] bg-white p-4 py-2 shadow-md lg:h-[12rem]">
                  <div className="flex h-full w-[70%] flex-col items-start justify-between gap-2">
                    <div className="bg- flex h-full flex-col lg:gap-2">
                      <div className="flex w-full items-start">
                        <span className="text-left font-domaine text-[12px] font-bold lg:text-[20px]">
                          {item.title}
                        </span>
                      </div>
                      <div className="w-full">
                        <span className="line-clamp text-left font-domaine text-[12px] font-light lg:text-[16px]">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="font-regular font-josefins text-[12px]">
                      {moment(item.updateAt).format("DD MMMM YYYY")}
                    </span>
                  </div>
                  <div
                    style={{ position: "relative" }}
                    className="h-[6rem] w-[6rem] overflow-hidden rounded-md bg-gray-100 lg:h-[10rem] lg:w-[10rem]"
                  >
                    <Image
                      src={item.image[0] || Assets.DefaultImage}
                      style={{ objectFit: "cover" }}
                      alt={`Blog ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                </div>
              </button>
            ))
          ) : (
            // Skeleton loader
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg flex h-[8rem] w-full animate-pulse items-center justify-between rounded-[8px] p-4 py-2 lg:h-[12rem]"
                >
                  <div className="flex h-full w-[70%] flex-col gap-2">
                    <div className="h-4 w-[60%] rounded bg-gray-200"></div>
                    <div className="h-4 w-[40%] rounded bg-gray-200"></div>
                    <div className="h-3 w-[30%] rounded bg-gray-200"></div>
                  </div>
                  <div className="h-[6rem] w-[6rem] animate-pulse rounded-md bg-gray-200 lg:h-[10rem] lg:w-[10rem]"></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-8 p-4 py-4 lg:w-[40%]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center">
              <div className="h-[10px] w-[4px] rounded-sm bg-[#F81539]" />
              <div className="px-2">
                <span className="font-domaine text-[16px] font-semibold lg:text-[24px]">
                  Popular Topics
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {(categoryNews && Array.isArray(categoryNews)
                ? categoryNews
                    .filter((item) => item.isRecomended === true)
                    .slice(0, 4)
                : []
              ).map((item, index) =>
                item && item.name ? (
                  <div
                    key={index}
                    onClick={() => handleCategoryClick(item.name)}
                    className="flex w-full cursor-pointer items-center justify-center rounded-[25px] py-[5px] font-josefins text-sm lg:text-lg"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  >
                    {item.name}
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
