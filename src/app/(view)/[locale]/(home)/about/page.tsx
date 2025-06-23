"use client";

import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Assets } from "@/assets";

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

const CustomArrowRight = ({ onClick }: any) => (
  <button
    className={`custom-arrow-button absolute right-[24rem] top-1 z-[99] flex h-10 w-10 -translate-y-1 transform items-center justify-center rounded-full bg-[#C1AE94] text-white focus:outline-none`}
    onClick={() => onClick()}
  >
    <ChevronRightIcon className="h-6 w-6 text-white" />
  </button>
);

const CustomArrowLeft = ({ onClick }: any) => (
  <button
    className={`custom-arrow-button absolute left-[24rem] top-1 z-[99] flex h-10 w-10 -translate-y-1 transform items-center justify-center rounded-full bg-[#C1AE94] text-white focus:outline-none`}
    onClick={() => onClick()}
  >
    <ChevronLeftIcon className="h-6 w-6 text-white" />
  </button>
);

export default function About() {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="relative w-full h-full">
      <div className="relative h-screen lg:h-[100vh] w-full flex items-center justify-center">
        <div className="absolute bottom-0 lg:top-0 left-0 z-0 lg:h-full w-full">
          <Image
            src={Assets.AboutUs}
            alt="About"
            className="lg:object-cover w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center flex-col gap-4 lg:gap-8 justify-center z-[999] w-full ">
          <Image
            src={Assets.IconFlower}
            alt="About"
            style={{
              objectFit: "cover",
              width: isMobile ? "18%" : "5%",
              height: isMobile ? "18%" : "5%",
            }}
          />
          <div className="flex flex-col lg:gap-4 justify-start items-start">
            <div className="relative w-[250px] h-[50px] lg:w-[500px] lg:h-[70px]">
              <Image src={Assets.Symphonyy} alt="Symphony" fill />
            </div>
            <div className="relative w-[250px] h-[50px] lg:w-[500px] lg:h-[70px]">
              <Image src={Assets.OffNature} alt="Symphony" fill />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-auto w-full flex-col gap-8 py-10 px-4 lg:px-48">
        <div className="">
          <h1 className="text-[16px] lg:text-[24px] font-thin text-black font-domaine text-center leading-8 lg:leading-[48px]">
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
            onClick={() => {
              router.push("/contact");
            }}
            className="font-josefins text-[16px] uppercase text-white"
          >
            Contact
          </button>
        </div>
      </div>
      <div className="h-screen w-full flex-col gap-8 lg:py-20 lg:px-48 z-[99]">
        <div className="relative h-full w-full">
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
            itemClass="h-"
            containerClass="w-full h-[90vh]"
            className="w-full"
            showDots={false}
            arrows={false}
          >
            {[Assets.Pure, Assets.AboutUs, Assets.Choose2].map(
              (image, index) => (
                <div
                  key={index}
                  className="relative p-2 h-screen flex flex-col justify-end ]"
                >
                  <Image
                    src={image}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    unoptimized
                    alt={`Slide ${index}`}
                    className="absolute inset-0 rounded-xl shadow-md"
                  />

                  {/* Title & Subtitle */}
                  <div className="relative z-10 flex text-center text-white mb-14 flex-col gap-4 justify-center items-center">
                    <h2 className="text-[28px] lg:text-[52px] font-domaine font-bold drop-shadow-md">
                      Pure and Natural
                    </h2>
                    <div className="w-[70%] ">
                      <p className="text-[24px] lg:text-[32px] text-center font-thin drop-shadow-sm">
                        We carefully source high-quality, natural ingredients,
                        free from harmful chemicals and additives.
                      </p>
                    </div>
                  </div>

                  {/* <div className="relative z-10 h-[5rem] flex items-center justify-center space-x-2 mb-4">
                    <CustomArrowLeft onClick={() => {}} />

                    <CustomDot onClick={() => {}} active={true} />

                    <CustomArrowRight onClick={() => {}} />
                  </div> */}
                </div>
              )
            )}
          </Carousel>
        </div>
      </div>
      <div className="flex justify-center items-center h-[40vh] w-full flex-col gap-8 py-4 lg:py-10 px-4 lg:px-48">
        <div className="flex-col gap-8 flex">
          <h1 className="text-[28px] lg:text-[52px] font-semibold text-black font-domaine text-center ">
            Our Promise
          </h1>
          <h1 className="text-[24px] font-thin text-black font-domaine text-center leading-8 lg:leading-[40px]">
            Every Echo Nusantara product is designed to enhance well-being,
            boost vitality, and promote a healthier lifestyle—all while staying
            true to our mission of honoring nature{"'"}s gifts.
          </h1>
        </div>
      </div>
      <div className="h-auto w-full flex-col gap-8 py-4 lg:py-20 z-[99] relative overflow-hidden">
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
            customDot={<CustomDot />}
            arrows={false}
            showDots={true}
            className="w-full h-[30vh] lg:h-[70vh]"
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
