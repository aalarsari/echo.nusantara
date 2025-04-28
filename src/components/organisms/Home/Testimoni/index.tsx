"use client";

import { Assets } from "@/assets";
import {
  CustomArrowLeft,
  CustomArrowRight,
} from "@/components/atoms/ButtomCustom";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import React, { useState } from "react";
import StarRatings from "react-star-ratings";

export const Testimoni = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className="relative h-full w-full py-10">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <h2 className="text-center font-domaine text-[32px] text-white">
            What Customers are Saying
          </h2>
        </div>
        <div
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
                items: 1,
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
            className="h-[50vh] w-full px-1"
            customLeftArrow={
              <CustomArrowLeft onClick={() => null} isHovered={isHovered} />
            }
            customRightArrow={
              <CustomArrowRight onClick={() => null} isHovered={isHovered} />
            }
          >
            <div className="mx-4 h-[350px] w-full cursor-pointer rounded-md bg-white p-5 shadow-product">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex h-[10vh] w-full flex-row items-center justify-start gap-2 rounded-[4px] px-2">
                    <div className="relative h-[50px] w-[50px] overflow-hidden rounded-[10px]">
                      <Image
                        src={Assets.Image01}
                        alt="Author Image"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div>
                        <h2 className="font-josefins text-[14px]">
                          Muhammad Fadli
                        </h2>
                      </div>
                      <span className="font-regular font-josefins text-[12px]">
                        Jakarta, Indonesia
                      </span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <h2 className="font-josefins text-[16px]">
                      The swallows nest from this company is really high
                      quality. In addition, I feel that my health is getting
                      better after consuming it regularly. Fast delivery and
                      very neat packaging. Will surely order again!
                    </h2>
                  </div>
                </div>
                <div className="w-full">
                  <StarRatings
                    rating={5}
                    starRatedColor="orange"
                    starEmptyColor="lightgray"
                    numberOfStars={5}
                    name="rating"
                    starDimension="30px"
                    starSpacing="5px"
                  />
                </div>
              </div>
            </div>
            <div className="mx-4 h-[350px] w-full cursor-pointer rounded-md bg-white p-5 shadow-product">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex h-[10vh] w-full flex-row items-center justify-start gap-2 rounded-[4px] px-2">
                    <div className="relative h-[50px] w-[50px] overflow-hidden rounded-[10px]">
                      <Image
                        src={Assets.Image01}
                        alt="Author Image"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div>
                        <h2 className="font-josefins text-[14px]">
                          Muhammad Fadli
                        </h2>
                      </div>
                      <span className="font-regular font-josefins text-[12px]">
                        Jakarta, Indonesia
                      </span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <h2 className="font-josefins text-[16px]">
                      The swallows nest from this company is really high
                      quality. In addition, I feel that my health is getting
                      better after consuming it regularly. Fast delivery and
                      very neat packaging. Will surely order again!
                    </h2>
                  </div>
                </div>
                <div className="w-full">
                  <StarRatings
                    rating={5}
                    starRatedColor="orange"
                    starEmptyColor="lightgray"
                    numberOfStars={5}
                    name="rating"
                    starDimension="30px"
                    starSpacing="5px"
                  />
                </div>
              </div>
            </div>
            <div className="mx-4 h-[350px] w-full cursor-pointer rounded-md bg-white p-5 shadow-product">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex h-[10vh] w-full flex-row items-center justify-start gap-2 rounded-[4px] px-2">
                    <div className="relative h-[50px] w-[50px] overflow-hidden rounded-[10px]">
                      <Image
                        src={Assets.Image01}
                        alt="Author Image"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div>
                        <h2 className="font-josefins text-[14px]">
                          Muhammad Fadli
                        </h2>
                      </div>
                      <span className="font-regular font-josefins text-[12px]">
                        Jakarta, Indonesia
                      </span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <h2 className="font-josefins text-[16px]">
                      The swallows nest from this company is really high
                      quality. In addition, I feel that my health is getting
                      better after consuming it regularly. Fast delivery and
                      very neat packaging. Will surely order again!
                    </h2>
                  </div>
                </div>
                <div className="w-full">
                  <StarRatings
                    rating={5}
                    starRatedColor="orange"
                    starEmptyColor="lightgray"
                    numberOfStars={5}
                    name="rating"
                    starDimension="30px"
                    starSpacing="5px"
                  />
                </div>
              </div>
            </div>
            <div className="mx-4 h-[350px] w-full cursor-pointer rounded-md bg-white p-5 shadow-product">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex h-[10vh] w-full flex-row items-center justify-start gap-2 rounded-[4px] px-2">
                    <div className="relative h-[50px] w-[50px] overflow-hidden rounded-[10px]">
                      <Image
                        src={Assets.Image01}
                        alt="Author Image"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div>
                        <h2 className="font-josefins text-[14px]">
                          Muhammad Fadli
                        </h2>
                      </div>
                      <span className="font-regular font-josefins text-[12px]">
                        Jakarta, Indonesia
                      </span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <h2 className="font-josefins text-[16px]">
                      The swallows nest from this company is really high
                      quality. In addition, I feel that my health is getting
                      better after consuming it regularly. Fast delivery and
                      very neat packaging. Will surely order again!
                    </h2>
                  </div>
                </div>
                <div className="w-full">
                  <StarRatings
                    rating={5}
                    starRatedColor="orange"
                    starEmptyColor="lightgray"
                    numberOfStars={5}
                    name="rating"
                    starDimension="30px"
                    starSpacing="5px"
                  />
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
