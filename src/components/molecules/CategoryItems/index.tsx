"use client";

import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import { Assets } from "@/assets";
import Link from "next/link";
import {
  CustomArrowLeft,
  CustomArrowRight,
  CustomDot,
} from "@/components/atoms/ButtomCustom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Testimoni } from "@/components/organisms/Home/Testimoni";

interface CategoryItem {
  id: number;
  name: string;
  products: Products[];
  Description: string;
}

export const CategoryItems = ({
  categoryData,
}: {
  categoryData: CategoryItem[] | null;
}) => {
  const [isHoveredLeft, setIsHoveredLeft] = useState<boolean>(false);
  const [isHoveredRight, setIsHoveredRight] = useState<boolean>(false);

  const formatCurrency = (value: number, currency: string, locale: string) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  };

  return (
    <div className="relative h-full w-full lg:px-10">
      <div className="absolute left-0 h-full w-full md:h-[140vh]">
        <Image
          src={Assets.Forestree}
          alt="Hutan"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="relative flex flex-col gap-6 px-10 py-20">
        <div
          data-aos="fade-up"
          data-aos-easing="linear"
          data-aos-duration="1000"
        >
          <h2 className="text-center font-domaine text-[24px] text-white lg:text-[32px]">
            Nature{"'"}s Finest. Our Premier Swiftlet Sanctuary.
          </h2>
        </div>
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-10 lg:h-[700px] lg:flex-row">
          <div className="z-[1] flex h-[38rem] w-full items-start justify-start rounded-[8px] bg-white/30 px-5 pb-8 pt-1 backdrop-blur-sm lg:h-[95%] lg:w-[36%]">
            {categoryData && (
              <div className="relative flex h-full w-full flex-col justify-between">
                <div
                  className="relative h-[380px] w-full lg:h-[470px]"
                  onMouseEnter={() => setIsHoveredLeft(true)}
                  onMouseLeave={() => setIsHoveredLeft(false)}
                >
                  {categoryData[0].products &&
                    categoryData[0].products.length > 0 && (
                      // Left Carousel
                      <Carousel
                        additionalTransfrom={0}
                        arrows={isHoveredLeft}
                        autoPlay
                        autoPlaySpeed={4000}
                        centerMode={false}
                        containerClass="carousel-container"
                        dotListClass=""
                        draggable
                        focusOnSelect={false}
                        infinite
                        itemClass="flex h-[300px] lg:h-[400px] items-center justify-center"
                        keyBoardControl
                        minimumTouchDrag={80}
                        renderButtonGroupOutside={false}
                        renderDotsOutside={false}
                        responsive={{
                          desktop: {
                            breakpoint: {
                              max: 3000,
                              min: 1024,
                            },
                            items: 1,
                          },
                          tablet: {
                            breakpoint: { max: 1024, min: 464 },
                            items: 1,
                          },
                          mobile: {
                            breakpoint: { max: 464, min: 0 },
                            items: 1,
                          },
                        }}
                        showDots={true}
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                        className="h-[380px] lg:h-[470px]"
                        customDot={
                          <CustomDot onClick={() => null} active={true} />
                        }
                        customLeftArrow={
                          <CustomArrowLeft
                            onClick={() => null}
                            isHovered={isHoveredLeft}
                          />
                        }
                        customRightArrow={
                          <CustomArrowRight
                            onClick={() => null}
                            isHovered={isHoveredLeft}
                          />
                        }
                      >
                        {/* {categoryData[0].products.map((product, index) => (
                          <div
                            key={index}
                            className="relative h-full w-full overflow-hidden rounded-md"
                          >
                            <Image
                              src={product.image1 || Assets.DefaultProduct}
                              alt={categoryData[0].name}
                              fill
                              style={{ objectFit: "cover" }}
                              priority={true}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="transition-transform duration-300 ease-in-out hover:scale-105"
                            />
                          </div>
                        ))}
                         */}
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImageMangkok}
                            alt="Image Mangkok"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div>
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImagePatahan}
                            alt="Image Patahan"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div>
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImageSudut}
                            alt="Image Sudut"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div>
                        {/* <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImageKeringImlek}
                            alt="Image Kering Imlek"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div> */}
                      </Carousel>
                    )}
                </div>
                <div className="flex h-[12rem] flex-col justify-between">
                  <div className="flex flex-col">
                    <span className="font-josefins text-[16px] text-black lg:text-[20px]">
                      {/* {categoryData[0].products[0].subDescriptions} */}
                      Products Dry by Echo Nusantara
                    </span>
                    <span className="font-josefins text-[16px] font-light text-black">
                      Our premium dried edible bird{"'"}s nest is a natural
                      delicacy, rich in nutrients and renowned for its health
                      benefits.
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-josefins text-[24px] font-medium text-black">
                        {/* {categoryData[0].products[0]
                      ? formatCurrency(
                          categoryData[0].products[0].priceIDR!,
                          "IDR",
                          "id",
                        )
                      : ""} */}
                        From Rp 900.000,00
                      </span>
                    </div>
                    <Link
                      href={"/product"}
                      className="flex h-[44px] w-[150px] transform items-center justify-center rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82]"
                    >
                      <div className="flex flex-row items-center justify-between">
                        <span className="mt-1 font-josefins text-[14px] uppercase text-white md:text-[16px]">
                          Shop Now
                        </span>
                        {/* <ChevronRightIcon className="h-5 w-5 text-white" /> */}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="z-[1] flex h-[38rem] w-full items-start justify-start rounded-[8px] bg-white/30 px-5 pb-8 pt-1 backdrop-blur-sm lg:h-[95%] lg:w-[36%]">
            {categoryData && (
              <div className="relative flex h-full w-full flex-col justify-between">
                <div
                  className="relative h-[380px] w-full lg:h-[470px]"
                  onMouseEnter={() => setIsHoveredRight(true)}
                  onMouseLeave={() => setIsHoveredRight(false)}
                >
                  {categoryData[1].products &&
                    categoryData[1].products.length > 0 && (
                      // Right Carousel
                      <Carousel
                        additionalTransfrom={0}
                        arrows={isHoveredRight}
                        autoPlay
                        autoPlaySpeed={4000}
                        centerMode={false}
                        containerClass="carousel-container"
                        dotListClass=""
                        draggable
                        focusOnSelect={false}
                        infinite
                        itemClass="flex h-[300px] lg:h-[400px] items-center justify-center"
                        keyBoardControl
                        minimumTouchDrag={80}
                        renderButtonGroupOutside={false}
                        renderDotsOutside={false}
                        responsive={{
                          desktop: {
                            breakpoint: {
                              max: 3000,
                              min: 1024,
                            },
                            items: 1,
                          },
                          tablet: {
                            breakpoint: { max: 1024, min: 464 },
                            items: 1,
                          },
                          mobile: {
                            breakpoint: { max: 464, min: 0 },
                            items: 1,
                          },
                        }}
                        showDots={true}
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                        className="h-[380px] lg:h-[470px]"
                        customDot={
                          <CustomDot onClick={() => null} active={true} />
                        }
                        customLeftArrow={
                          <CustomArrowLeft
                            onClick={() => null}
                            isHovered={isHoveredRight}
                          />
                        }
                        customRightArrow={
                          <CustomArrowRight
                            onClick={() => null}
                            isHovered={isHoveredRight}
                          />
                        }
                      >
                        {/* {categoryData[1].products.map((product, index) => (
                          <div
                            key={index}
                            className="relative h-full w-full overflow-hidden rounded-md"
                          >
                            <Image
                              src={product.image1 || Assets.DefaultProduct}
                              alt={categoryData[0].name}
                              fill
                              style={{ objectFit: "cover" }}
                              priority={true}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="transition-transform duration-300 ease-in-out hover:scale-105"
                            />
                          </div>
                        ))} */}
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImageTeja}
                            alt="Image Teja"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div>
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImagePandan}
                            alt="Image Pandan"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div>
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImageJahe}
                            alt="Image Jahe"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div>
                        {/* <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImageImlek1}
                            alt="Image Imlek 1"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div> */}
                        {/* <div className="relative h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={Assets.ImageImlek2}
                            alt="Image Imlek 2"
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="transition-transform duration-300 ease-in-out hover:scale-105"
                          />
                        </div> */}
                      </Carousel>
                    )}
                </div>
                <div className="flex h-[12rem] flex-col justify-between">
                  <div className="flex flex-col">
                    <span className="font-josefins text-[16px] text-black lg:text-[20px]">
                      {/* {categoryData[1].products[0].subDescriptions} */}
                      Products Ready to Serve by Echo Nusantara
                    </span>
                    <span className="font-josefins text-[16px] font-light text-black">
                      Enjoy the benefits of our ready to drink edible bird {"'"}
                      s nest, crafted from premium, hand-cleaned swiftlet nests.
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-josefins text-[24px] font-medium text-black">
                        {/* {categoryData[0].products[0]
                      ? formatCurrency(
                          categoryData[1].products[0].priceIDR!,
                          "IDR",
                          "id",
                        )
                      : ""} */}
                        From Rp 115.500,00
                      </span>
                    </div>
                    <Link
                      href={"/product"}
                      className="flex h-[44px] w-[150px] transform items-center justify-center rounded-[4px]  bg-gradient-to-t from-[#B69B78] to-[#CDB698] transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82]"
                    >
                      <div className="flex flex-row items-center justify-between">
                        <span className="mt-1 font-josefins text-[14px] uppercase text-white md:text-[16px]">
                          Shop Now
                        </span>
                        {/* <ChevronRightIcon className="h-5 w-5 text-white" /> */}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Testimoni /> */}
    </div>
  );
};
