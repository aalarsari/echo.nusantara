"use client";

import { GetBlogPerCategory } from "@/controller/noAuth/blog";
import { Blog } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import moment from "moment";

export default function DetailCategoryComponent({
  params,
}: {
  params: { category: string };
}) {
  const [categoryDetail, setCategoryDetail] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(6);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<string>("");

  // Static category data
  const categories = [
    "Technology",
    "Health",
    "Business",
    "Sports",
    "Lifestyle",
    "Entertainment",
  ];

  useEffect(() => {
    if (params?.category) {
      setCategory(params.category);
    }
  }, [params?.category]);

  useEffect(() => {
    if (category) {
      const fetchDetailShop = async () => {
        try {
          const res = await GetBlogPerCategory(category, page, pageSize);
          const body = await res.json();

          if (res.ok) {
            setCategoryDetail(body.data.blog || []);
            console.log(body.data.blog, "ASdasdas");
          } else {
            setError(body.message || "Failed to fetch data");
          }
        } catch (error) {
          setError("An error occurred while fetching data.");
        }
      };
      fetchDetailShop();
    }
  }, [category, page, pageSize]);

  const otherBlogs = categoryDetail.slice(1);

  return (
    <div className="mx-auto h-auto w-full max-w-6xl pt-20">
      <div className="mt-12 flex w-full flex-col gap-4">
        <div className="flex flex-row items-center">
          <div className="h-[10px] w-[4px] rounded-sm bg-[#F81539]" />
          <div className="px-2">
            <span className="font-domaine text-[16px] font-semibold lg:text-[24px]">
              News Regarding :{" "}
            </span>
            <span className="font-domaine text-[16px] font-semibold lg:text-[24px]">
              {category}
            </span>
          </div>
        </div>

        {categoryDetail.length > 0 ? (
          <div className="grid grid-cols-3 gap-10">
            {categoryDetail.map((item, index) => (
              <div
                key={index}
                className="flex h-[48vh] flex-col justify-between gap-2 rounded-[8px] p-2 shadow-md transition-all duration-300 hover:scale-105"
              >
                <div>
                  <div className="relative h-[26vh] w-full overflow-hidden rounded-[6px]">
                    <Image
                      fill
                      src={item.image[0] || Assets.DefaultImage}
                      style={{ objectFit: "cover" }}
                      alt={`Blog ${index + 1}`}
                      priority
                    />
                  </div>
                  <div className="mt-2">
                    <span className="truncate-line-clamp-1 text-[20px] font-semibold">
                      {item.title}
                    </span>
                  </div>
                  <p className="truncate-line-clamp-2 text-[16px]">
                    {item.subtitle}
                  </p>
                </div>
                <div>
                  <span className="text-[14px] text-gray-600">
                    {moment(item.updateAt).format("DD MMMM YYYY")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-screen w-full items-center justify-center">
            <span className="font-josefins text-[24px] font-semibold">
              No blogs found in this category.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
