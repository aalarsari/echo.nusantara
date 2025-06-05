"use client";

import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import {
  CustomArrowLeft,
  CustomArrowRight,
  CustomDot,
} from "@/components/atoms/ButtomCustom";
import { Assets } from "@/assets";

interface BannerItem {
  id: number;
  path: string;
  subtitle: string;
  title: string;
  category: string;
}

export const BannerItems = ({ bannerData }: { bannerData: BannerItem[] }) => {
  interface CustomDotProps {
    onClick?: () => void;
    active?: boolean;
  }
  const CustomDot: React.FC<CustomDotProps> = ({ onClick, active }) => {
    return (
      <button
        onClick={onClick}
        className={`mx-1 rounded-full transition-all duration-500
        ${
          active
            ? "h-3 w-8 bg-gradient-to-tr from-[#D5BD9F] to-[#9D846D]"
            : "relative h-3 w-3 rounded-full p-[1px]"
        }`}
        style={
          !active
            ? {
                background: "linear-gradient(to top right, #D5BD9F, #9D846D)",
              }
            : undefined
        }
      >
        {!active && (
          <span className="block h-full w-full rounded-full bg-white" />
        )}
      </button>
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Banner */}
      <div className="flex h-[65vh] items-center justify-center">
        <Carousel
          additionalTransfrom={0}
          arrows={false}
          autoPlay
          autoPlaySpeed={4000}
          centerMode={false}
          containerClass="carousel-container"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass="h-[100vh]"
          keyBoardControl
          minimumTouchDrag={80}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 1,
              partialVisibilityGutter: 40,
            },
            tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 1,
              partialVisibilityGutter: 30,
            },
            mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 1,
              partialVisibilityGutter: 30,
            },
          }}
          showDots={true}
          sliderClass=""
          slidesToSlide={1}
          swipeable
          className="h-[80vh] w-full"
          customDot={<CustomDot />}
        >
          {bannerData
            .filter((bannerItem) => bannerItem.category === "Products")
            .map((bannerItem, index) => (
              <div key={index}>
                <div className="flex h-[100vh] items-center justify-center">
                  <div className="relative h-[100%] w-full bg-black md:h-[65%]">
                    <Image
                      src={bannerItem.path || Assets.DefaultImage}
                      alt={bannerItem.title}
                      fill
                      style={{ objectFit: "contain" }}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            ))}
        </Carousel>
      </div>
    </div>
  );
};
