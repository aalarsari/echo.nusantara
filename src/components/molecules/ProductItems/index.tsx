"use client";

import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CustomArrowLeft,
  CustomArrowRight,
} from "@/components/atoms/ButtomCustom";
import { Assets } from "@/assets";

interface ProductItem {
  id: number;
  image1: string;
  name: string;
  slug: string;
  weight: number;
  priceIDR: number;
}

export const ProductItems = ({
  productData,
}: {
  productData: ProductItem[];
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isHoveredIndex, setIsHoveredIndex] = useState<number | null>(null);
  const [productDetail, setProductDetail] = useState(null);
  const router = useRouter();

  const handleProductClick = (slug: string) => {
    try {
      setProductDetail(null);
      router.push(`/shop/${slug}`);
    } catch (error) {
      console.error("Error navigating to product detail:", error);
    }
  };

  const handleMouseEnter = (index: number) => {
    setIsHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setIsHoveredIndex(null);
  };

  const formatCurrency = (value: number, currency: string, locale: string) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col gap-6 px-8 py-24 md:max-w-3xl md:px-0 lg:max-w-7xl">
      <div className="">
        <h2
          data-aos="fade-up"
          data-aos-easing="linear"
          data-aos-duration="1000"
          className="px-10 text-center font-domaine text-[24px] font-thin lg:px-0 lg:text-[32px]"
        >
          Savor Authenticity: Real Food, Real Favorite
        </h2>
      </div>
      <div
        className="flex h-full w-full items-start justify-start"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Carousel
          additionalTransfrom={0}
          arrows={isHovered}
          autoPlay={false}
          centerMode={false}
          containerClass="carousel-container"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite={true}
          itemClass="flex items-center justify-center"
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
              items: 4,
              partialVisibilityGutter: 40,
            },
            tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 2,
              partialVisibilityGutter: 30,
            },
            mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 1,
              partialVisibilityGutter: 30,
            },
          }}
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
          className="h-[65vh] w-full px-1"
          customLeftArrow={
            <CustomArrowLeft onClick={() => null} isHovered={isHovered} />
          }
          customRightArrow={
            <CustomArrowRight onClick={() => null} isHovered={isHovered} />
          }
        >
          <div
            // key={index}
            onClick={() =>
              router.push(`/shop/minuman-sarang-burung-walet-rasa-pandan`)
            }
            data-aos="zoom-in"
            data-aos-easing="linear"
            data-aos-duration="1500"
            className="w-full px-4"
          >
            <div className="h-[400px] w-full cursor-pointer rounded-[8px] p-5 shadow-product shadow-gray-100">
              <div className="flex h-full w-full flex-col gap-2">
                <div className="relative h-[15rem] w-full overflow-hidden rounded-md">
                  <Image
                    src={Assets.Pandan}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    priority={true}
                    // onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    // className={`transform transition-transform duration-300 ${isHoveredIndex === index ? "scale-110" : "scale-100"}`}
                    alt="Minuman Sarang Burung Wallet Rasa Pandan"
                    sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-col justify-between gap-2">
                  <div className="py-1">
                    <span className="font-domaine text-[18px] font-light text-black">
                      Minuman Sarang Burung Walet - Rasa Pandan
                    </span>
                  </div>
                  <span className="font-josefins text-[18px] text-black">
                    Rp. 275.000
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            // key={index}
            onClick={() =>
              router.push(`/shop/minuman-sarang-burung-walet-rasa-kurma`)
            }
            data-aos="zoom-in"
            data-aos-easing="linear"
            data-aos-duration="1500"
            className="w-full px-4"
          >
            <div className="h-[400px] w-full cursor-pointer rounded-[8px] p-5 shadow-product shadow-gray-100">
              <div className="flex h-full w-full flex-col gap-2">
                <div className="relative h-[15rem] w-full overflow-hidden rounded-md">
                  <Image
                    src={Assets.Kurma}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    priority={true}
                    // onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    // className={`transform transition-transform duration-300 ${isHoveredIndex === index ? "scale-110" : "scale-100"}`}
                    alt="Minuman Sarang Burung Wallet Rasa Kurma"
                    sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex h-[5rem] flex-col justify-between gap-2">
                  <div className="py-1">
                    <span className="font-domaine text-[18px] font-light text-black">
                      Minuman Sarang Burung Walet - Rasa Kurma
                    </span>
                  </div>
                  <span className="font-josefins text-[18px] text-black">
                    Rp. 275.000
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            // key={index}
            onClick={() =>
              router.push(`/shop/teja-pandan-minuman-sarang-burung-walet`)
            }
            data-aos="zoom-in"
            data-aos-easing="linear"
            data-aos-duration="1500"
            className="w-full px-4"
          >
            <div className="h-[400px] w-full cursor-pointer rounded-[8px] p-5 shadow-product shadow-gray-100">
              <div className="flex h-full w-full flex-col gap-2">
                <div className="relative h-[15rem] w-full overflow-hidden rounded-md">
                  <Image
                    src={Assets.Teja}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    priority={true}
                    // onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    // className={`transform transition-transform duration-300 ${isHoveredIndex === index ? "scale-110" : "scale-100"}`}
                    alt="Teja Pandan - Minuman Sarang Burung Walet"
                    sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex h-[5rem] flex-col justify-between gap-2">
                  <div className="py-1">
                    <span className="font-domaine text-[18px] font-light text-black">
                      Teja Pandan - Minuman Sarang Burung Walet
                    </span>
                  </div>
                  <span className="font-josefins text-[18px] text-black">
                    Rp. 115.500
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            // key={index}
            onClick={() =>
              router.push(
                `/shop/minuman-sarang-burung-walet-hampers-premium-isi-8-botol`,
              )
            }
            data-aos="zoom-in"
            data-aos-easing="linear"
            data-aos-duration="1500"
            className="w-full px-4"
          >
            <div className="h-[400px] w-full cursor-pointer rounded-[8px] p-5 shadow-product shadow-gray-100">
              <div className="flex h-full w-full flex-col gap-2">
                <div className="relative h-[15rem] w-full overflow-hidden rounded-md">
                  <Image
                    src={Assets.HampersPremium}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    priority={true}
                    // onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    // className={`transform transition-transform duration-300 ${isHoveredIndex === index ? "scale-110" : "scale-100"}`}
                    alt="Minuman Sarang Burung Walet Hampers Premium"
                    sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex h-[5rem] flex-col justify-between gap-2">
                  <div className="py-1">
                    <span className="font-domaine text-[18px] font-light text-black">
                      Minuman Sarang Burung Walet Hampers Premium
                    </span>
                  </div>
                  <span className="font-josefins text-[18px] text-black">
                    Rp 3.080.000
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            // key={index}
            onClick={() =>
              router.push(
                `/shop/minuman-sarang-burung-walet-hampers-deluxe-a-8-botol-serat-kering`,
              )
            }
            data-aos="zoom-in"
            data-aos-easing="linear"
            data-aos-duration="1500"
            className="w-full px-4"
          >
            <div className="h-[400px] w-full cursor-pointer rounded-[8px] p-5 shadow-product shadow-gray-100">
              <div className="flex h-full w-full flex-col gap-2">
                <div className="relative h-[15rem] w-full overflow-hidden rounded-md">
                  <Image
                    src={Assets.HampersA}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    priority={true}
                    // onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    // className={`transform transition-transform duration-300 ${isHoveredIndex === index ? "scale-110" : "scale-100"}`}
                    alt="Minuman Sarang Burung Walet Hampers Deluxe A"
                    sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex h-[5rem] flex-col justify-between gap-2">
                  <div className="py-1">
                    <span className="font-domaine text-[18px] font-light text-black">
                      Minuman Sarang Burung Walet Hampers Deluxe A
                    </span>
                  </div>
                  <span className="font-josefins text-[18px] text-black">
                    Rp 3.850.000
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            // key={index}
            onClick={() =>
              router.push(
                `/shop/minuman-sarang-burung-walet-hampers-deluxe-b-isi-16-botol`,
              )
            }
            data-aos="zoom-in"
            data-aos-easing="linear"
            data-aos-duration="1500"
            className="w-full px-4"
          >
            <div className="h-[400px] w-full cursor-pointer rounded-[8px] p-5 shadow-product shadow-gray-100">
              <div className="flex h-full w-full flex-col gap-2">
                <div className="relative h-[15rem] w-full overflow-hidden rounded-md">
                  <Image
                    src={Assets.HampersB}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    priority={true}
                    // onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    // className={`transform transition-transform duration-300 ${isHoveredIndex === index ? "scale-110" : "scale-100"}`}
                    alt="Minuman Sarang Burung Walet Hampers Deluxe B"
                    sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex h-[5rem] flex-col justify-between gap-2">
                  <div className="py-1">
                    <span className="font-domaine text-[18px] font-light text-black">
                      Minuman Sarang Burung Walet Hampers Deluxe B
                    </span>
                  </div>
                  <span className="font-josefins text-[18px] text-black">
                    Rp 4.730.000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};
