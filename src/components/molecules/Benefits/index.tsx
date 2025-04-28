"use client";

import { Assets } from "@/assets";
import React from "react";
import Image from "next/image";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

export const Benefits = () => {
  return (
    <div className="flex h-full flex-col py-6 lg:gap-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <div>
          <h2
            data-aos="fade-up"
            data-aos-easing="linear"
            data-aos-duration="600"
            className="text-center font-domaine text-[24px] lg:text-[32px]"
          >
            6 Things To Know About benefit Bird{"'"}s Nest.
          </h2>
        </div>
        <span
          data-aos="fade-up"
          data-aos-easing="linear"
          data-aos-duration="700"
          className="px-10 text-center font-josefins text-[20px] font-semibold lg:px-0 lg:text-[24px]"
        >
          Did you know these interesting benefit about Bird{"'"}s Nest?
        </span>
        <div className="block h-full w-[50%] lg:hidden">
          <Image
            src={Assets.ImgBenefit}
            alt="Benefits"
            width={500}
            height={500}
          />
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="relative flex h-[138vh] w-full items-center justify-center px-2 lg:px-0">
          <div className="layer-bg bg-background-benefit bg-no-repeat" />
          <div className="absolute top-[12rem] h-full w-[50%]">
            <Image
              src={Assets.ImgBenefit}
              alt="Benefits"
              width={800}
              height={800}
              sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="relative h-screen w-full">
            <div className="grid h-full w-full grid-cols-2">
              <div className="relative right-0 flex h-full w-full items-start justify-start gap-2 lg:items-end lg:justify-end lg:pr-[2rem]">
                <div
                  data-aos="fade-right"
                  data-aos-duration="1500"
                  className="flex w-full flex-col items-start pb-[4rem] lg:w-[80%] lg:items-end lg:pb-[9.5rem]"
                >
                  <div>
                    <h2 className="text-start font-domaine text-[16px] lg:text-end lg:text-[20px]">
                      The Purest Gift from East Kalimantan
                    </h2>
                  </div>
                  <span className="text-start font-josefins text-[14px] font-normal lg:text-end lg:text-[18px]">
                    Contains 37,8 grams of premium bird{"'"}s nest and AAA grade
                    quality with no chemicals or preservative.
                  </span>
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-duration="500"
                  className="hidden lg:block"
                >
                  <Image
                    src={Assets.LineTopLeft}
                    // width={100}
                    // height={100}
                    style={{ width: "auto", height: "auto" }}
                    alt="Line Top Right"
                  />
                </div>
              </div>
              <div className="relative flex h-full w-full items-start justify-end lg:items-end lg:pb-[1rem] lg:pl-[8rem]">
                <div className="flex items-end justify-end lg:items-start lg:justify-start lg:gap-8">
                  <div
                    data-aos="fade-left"
                    data-aos-duration="500"
                    className="hidden lg:block"
                  >
                    <Image
                      src={Assets.LineTopRight}
                      // width={45}
                      // height={45}
                      style={{ width: "auto", height: "auto" }}
                      alt="Line Top Right"
                    />
                  </div>

                  <div
                    data-aos="fade-left"
                    data-aos-duration="1500"
                    className="flex w-full flex-col items-end justify-end gap-2 lg:w-[80%] lg:items-start lg:justify-start "
                  >
                    <div>
                      <h2 className="text-end font-domaine text-[16px] lg:text-[20px]">
                        Incomparable Quality
                      </h2>
                    </div>
                    <span className="text-end font-josefins text-[14px] font-normal lg:text-start lg:text-[18px]">
                      Echo Nusantara{"'"}s bird{"'"} nests are created by the
                      swiflets that inhabit an undisturbed 174,000 hectare
                      pristine forset in East Kalimantan.
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative flex h-full w-full gap-8 pr-[10rem] lg:pb-[5rem]">
                <div
                  data-aos="fade-right"
                  data-aos-duration="1500"
                  className="flex w-full flex-col items-start justify-start lg:items-end"
                >
                  <div>
                    <h2 className="text-start font-domaine text-[16px] lg:text-[20px]">
                      Organic Dry Bird{"'"}s Nest
                    </h2>
                  </div>
                  <span className="w-[70%] text-start font-josefins text-[14px] font-normal lg:w-full lg:text-end lg:text-[18px]">
                    Echo Nusantara{"'"}s dry bird{"'"}s nest is carefully
                    cleaned by hand, with a high standard production process to
                    ensure hygiene, purity and safety for consumption.
                  </span>
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-duration="500"
                  className="hidden lg:block"
                >
                  <Image
                    src={Assets.LineMiddleLeft}
                    // width={400}
                    // height={400}
                    style={{ width: "auto", height: "auto" }}
                    alt="Line Top Right"
                  />
                </div>
              </div>
              <div className="relative flex h-full w-full items-start justify-end lg:items-start lg:justify-end lg:pl-[10rem]">
                <div className="lg:flex lg:gap-4">
                  <div
                    data-aos="fade-left"
                    data-aos-duration="500"
                    className="hidden lg:block"
                  >
                    <Image
                      src={Assets.LineMiddleRight}
                      // width={200}
                      // height={200}
                      style={{ width: "auto", height: "auto" }}
                      alt="Line Top Right"
                    />
                  </div>

                  <div
                    data-aos="fade-left"
                    data-aos-duration="1500"
                    className="flex w-full flex-col items-end justify-end gap-2 pl-[2rem] lg:w-[80%] lg:items-start lg:justify-start"
                  >
                    <div>
                      <h2 className="text-end font-domaine text-[16px] lg:text-start lg:text-[20px]">
                        Authenticity Bird{"'"}s Nest
                      </h2>
                    </div>
                    <span className="w-[50%] text-end font-josefins text-[14px] font-normal lg:w-full lg:text-start lg:text-[18px]">
                      Discover the authenticity of Echo Nusantara premium dry
                      bird{"'"}s nest (Cup, Triangle and Strips) with
                      non-chemical and no bleach to provide overall general
                      wellness.
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative flex h-full w-full gap-4 lg:pr-[5rem]">
                <div
                  data-aos="fade-right"
                  data-aos-duration="1500"
                  className="flex w-full flex-col items-start lg:items-end lg:justify-start"
                >
                  <div>
                    <h2 className="font-domaine text-[16px] lg:text-[20px]">
                      From Indonesia for The World
                    </h2>
                  </div>
                  <span className="text-start font-josefins text-[14px] font-normal lg:text-end lg:text-[18px]">
                    Echo Nusantara, from Indonesia, envisions a better world in
                    the future. Our aspiration is to create and deliver the best
                    product to the world
                  </span>
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-duration="500"
                  className="hidden lg:block"
                >
                  <Image
                    src={Assets.LineBottomLeft}
                    // width={400}
                    // height={400}
                    style={{ width: "auto", height: "auto" }}
                    alt="Line Top Right"
                  />
                </div>
              </div>
              <div className="relative flex h-full w-full flex-col gap-4 lg:pb-2 lg:pl-[7rem]">
                <div
                  data-aos="fade-left"
                  data-aos-duration="500"
                  className="hidden lg:block"
                >
                  <Image
                    src={Assets.LineBottomRight}
                    // width={100}
                    // height={100}
                    style={{ width: "auto", height: "auto" }}
                    alt="Line Top Right"
                  />
                </div>
                <div
                  data-aos="fade-left"
                  data-aos-duration="1500"
                  className="relative flex w-full flex-col items-end justify-end lg:w-[80%] lg:items-start lg:justify-start"
                >
                  <div>
                    <h2 className="text-end font-domaine text-[16px] lg:text-start lg:text-[20px]">
                      Purely Organic
                    </h2>
                  </div>
                  <span className="text-end font-josefins text-[14px] font-normal lg:text-start lg:text-[18px]">
                    To pursue our commitment to sustainability, we do ethical
                    harvesting in the process, adn in order to deliver full
                    benefits and safe products for you.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="flex  w-full items-start justify-center py-10 lg:py-14">
          <div className="w-full px-4">
            <div className="mx-auto w-full max-w-2xl rounded-[8px] bg-white p-2 shadow-sm">
              <Disclosure
                as="div"
                className=" border-b-[0.75px] border-gray-100"
              >
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/10 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-semibold text-[#C1AE94] lg:text-[20px]">
                        The Purest Gift from East Kalimantan
                      </h2>
                      <ChevronUpIcon
                        className={`${
                          open
                            ? "trasnition-all rotate-180 transform duration-300"
                            : "transfomr transition-all duration-300"
                        } h-5 w-5 text-[#C1AE94]`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-500 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-100 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="my-2 rounded-[4px] px-4 py-4 text-[16px] text-gray-500 lg:text-[20px] ">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-normal text-[#231F20]">
                            Contains 37,8 grams of premium bird{"'"}s nest and
                            AAA grade quality with no chemicals or preservative.
                          </h2>
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
              <Disclosure
                as="div"
                className="mt-2  border-b-[0.75px] border-gray-100"
              >
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/10 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-semibold text-[#C1AE94] lg:text-[20px]">
                        Incomparable Quality
                      </h2>
                      <ChevronUpIcon
                        className={`${
                          open
                            ? "trasnition-all rotate-180 transform duration-300"
                            : "transfomr transition-all duration-300"
                        } h-5 w-5 text-[#C1AE94]`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-500 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-100 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[16px] text-gray-500 lg:text-[20px]">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-normal text-[#231F20]">
                            Echo Nusantara{"'"}s bird{"'"} nests are created by
                            the swiflets that inhabit an undisturbed 174,000
                            hectare pristine forset in East Kalimantan.
                          </h2>
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
              <Disclosure
                as="div"
                className="mt-2  border-b-[0.75px] border-gray-100"
              >
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/10 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-semibold text-[#C1AE94] lg:text-[20px]">
                        Organic Dry Bird{"'"}s Nest
                      </h2>
                      <ChevronUpIcon
                        className={`${
                          open
                            ? "trasnition-all rotate-180 transform duration-300"
                            : "transfomr transition-all duration-300"
                        } h-5 w-5 text-[#C1AE94]`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-500 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-100 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[16px] text-gray-500 lg:text-[20px]">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-normal text-[#231F20]">
                            Echo Nusantara{"'"}s dry bird{"'"}s nest is
                            carefully cleaned by hand, with a high standard
                            production process to ensure hygiene, purity and
                            safety for consumption.
                          </h2>
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
              <Disclosure
                as="div"
                className="mt-2  border-b-[0.75px] border-gray-100"
              >
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/10 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-semibold text-[#C1AE94] lg:text-[20px]">
                        Authenticity Bird{"'"}s Nest
                      </h2>
                      <ChevronUpIcon
                        className={`${
                          open
                            ? "trasnition-all rotate-180 transform duration-300"
                            : "transfomr transition-all duration-300"
                        } h-5 w-5 text-[#C1AE94]`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-500 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-100 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[16px] text-gray-500 lg:text-[20px]">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-normal text-[#231F20]">
                            Discover the authenticity of Echo Nusantara premium
                            dry bird{"'"}s nest (Cup, Triangle and Strips) with
                            non-chemical and no bleach to provide overall
                            general wellness.
                          </h2>
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className="mt-2 ">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/10 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-semibold text-[#C1AE94] lg:text-[20px]">
                        From Indonesia for The World
                      </h2>
                      <ChevronUpIcon
                        className={`${
                          open
                            ? "trasnition-all rotate-180 transform duration-300"
                            : "transfomr transition-all duration-300"
                        } h-5 w-5 text-[#C1AE94]`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-500 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-100 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[16px] text-gray-500 lg:text-[20px]">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-normal text-[#231F20]">
                            Echo Nusantara, from Indonesia, envisions a better
                            world in the future. Our aspiration is to create and
                            deliver the best product to the world
                          </h2>
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className="mt-2 ">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/10 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-semibold text-[#C1AE94] lg:text-[20px]">
                        Purely Organic
                      </h2>
                      <ChevronUpIcon
                        className={`${
                          open
                            ? "trasnition-all rotate-180 transform duration-300"
                            : "transfomr transition-all duration-300"
                        } h-5 w-5 text-[#C1AE94]`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-500 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-100 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[16px] text-gray-500 lg:text-[20px]">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-normal text-[#231F20]">
                            To pursue our commitment to sustainability, we do
                            ethical harvesting in the process, adn in order to
                            deliver full benefits and safe products for you
                          </h2>
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
