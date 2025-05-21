"use client";

import { Assets } from "@/assets";
import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDotProps {
  onClick?: () => void;
  active?: boolean;
}

const CustomDot: React.FC<CustomDotProps> = ({ onClick, active }) => {
  return (
    <button
      className={`mx-1 rounded-full transition-all duration-500 mb-10 ${
        active
          ? "h-3 w-8 bg-[#D5BD9F] ring-2 ring-[#D5BD9F]"
          : "h-3 w-3 bg-transparent ring-2 ring-[#D5BD9F]"
      }`}
      onClick={onClick}
    />
  );
};

const CustomArrow = ({
  onClick,
  direction,
}: {
  onClick?: () => void;
  direction: "left" | "right";
}) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-gray-600/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 ${
        direction === "left" ? "left-2" : "right-2"
      }`}
    >
      {direction === "left" ? (
        <ChevronLeft size={24} />
      ) : (
        <ChevronRight size={24} />
      )}
    </button>
  );
};

export default function About() {
  return (
    <div className="">
      <div className="relative h-[100vh] w-full flex items-center justify-center">
        <div className="absolute top-0 left-0 z-0 h-full w-full">
          <Image
            src={Assets.AboutUs}
            alt="About"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
        <div className="flex items-center flex-col gap-8 justify-center z-[999] w-full ">
          <Image
            src={Assets.IconFlower}
            alt="About"
            style={{ objectFit: "cover", width: "5%", height: "5%" }}
          />
          <div className="flex flex-col gap-4 justify-start items-start">
            <h1 className="text-[64px] font-thin text-black font-domaine text-left">
              SYMPHONY
            </h1>
            <h1 className="text-[64px] font-thin text-black font-domaine text-left">
              OF NATURE
            </h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-auto w-full flex-col gap-8 py-10 px-48">
        <div className="">
          <h1 className="text-[24px] font-thin text-black font-domaine text-center leading-[48px]">
            At Echo Nusantara, we believe in the power of nature to nurture,
            heal, and rejuvenate. Inspired by the rich botanical heritage of
            Indonesia, we craft premium health and wellness products using the
            finest natural ingredients, ensuring purity, potency, and
            sustainability in every drop.
          </h1>
        </div>
        <div className="relative  z-[10] flex transform ring-1 ring-[#C1AE94] items-center justify-center rounded-[50px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82] w-[237px] h-[52px]">
          <button
            type="submit"
            className="font-josefins text-[14px] uppercase text-white"
          >
            Contact
          </button>
        </div>
      </div>
      <div className="h-screen w-full flex-col gap-8 py-20 px-48 z-[99]">
        <div className="relative">
          <Carousel
            responsive={{
              superLargeDesktop: {
                breakpoint: { max: 4000, min: 1024 },
                items: 1,
              },
              desktop: { breakpoint: { max: 1024, min: 768 }, items: 1 },
              tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
            }}
            autoPlay
            infinite
            partialVisible={false}
            itemClass=""
            containerClass="w-full h-full"
            className="w-full"
            customLeftArrow={<CustomArrow direction="left" />}
            customRightArrow={<CustomArrow direction="right" />}
            customDot={<CustomDot />}
            showDots={true}
          >
            {[Assets.Pure, Assets.CoverBenefits, Assets.AboutUs].map(
              (image, index) => (
                <div key={index} className="p-2">
                  <Image
                    src={image}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    unoptimized
                    alt={`Slide ${index}`}
                    className="h-full w-full rounded-xl shadow-md"
                  />
                </div>
              )
            )}
          </Carousel>
        </div>
      </div>
      <div className="flex justify-center items-center h-[40vh] w-full flex-col gap-8 py-10 px-48">
        <div className="flex-col gap-8 flex">
          <h1 className="text-[52px] font-thin text-black font-domaine text-center ">
            Our Promise
          </h1>
          <h1 className="text-[24px] font-thin text-black font-domaine text-center leading-[40px]">
            Every Echo Nusantara product is designed to enhance well-being,
            boost vitality, and promote a healthier lifestyle—all while staying
            true to our mission of honoring nature{"'"}s gifts.
          </h1>
        </div>
      </div>
      <div className="h-auto w-full flex-col gap-8 py-20 z-[99] relative overflow-hidden">
        <div className="relative">
          <Carousel
            responsive={{
              superLargeDesktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 1,
                slidesToSlide: 1,
              },
              desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 1,
                slidesToSlide: 1,
              },
              tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 1,
                slidesToSlide: 1,
              },
              mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
                slidesToSlide: 1,
              },
            }}
            autoPlay
            infinite
            itemClass="px-4"
            centerMode
            customLeftArrow={<CustomArrow direction="left" />}
            customRightArrow={<CustomArrow direction="right" />}
            customDot={<CustomDot />}
            showDots={true}
          >
            {[Assets.Promise1, Assets.Promise2, Assets.Promise3].map(
              (image, index) => (
                <div key={index}>
                  <Image
                    src={image}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    unoptimized
                    alt={`Slide ${index}`}
                    className="h-full w-full rounded-xl shadow-md"
                  />
                </div>
              )
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
