"use client";

import { GetDetailBlog } from "@/controller/noAuth/blog";
import { Blog } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import moment from "moment";

export default function DetailNewsComponent({
  params,
}: {
  params: { slug: string };
}) {
  const [blogDetail, setBlogDetail] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      {blogDetail && (
        <div className="h-full w-full px-8">
          <div className="relative mx-auto my-24 flex h-full w-full max-w-4xl flex-col items-center justify-start gap-8 overflow-y-auto">
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <div className="flex flex-col">
                <h2 className="text-center font-domaine text-[22px] font-semibold lg:text-[32px]">
                  {blogDetail.title}
                </h2>
                <p className="text-center font-josefins text-[14px] font-light lg:text-[20px]">
                  {blogDetail.subtitle}
                </p>
              </div>
              <span>{moment(blogDetail.updateAt).format("DD MMMM YYYY")}</span>
            </div>
            <div
              style={{ position: "relative" }}
              className="h-[40vh] w-full overflow-hidden rounded-[8px]"
            >
              <Image
                src={blogDetail.image[0] || Assets.DefaultImage}
                alt={blogDetail.title}
                fill
                style={{ objectFit: "contain" }}
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
          </div>
        </div>
      )}
    </>
  );
}
