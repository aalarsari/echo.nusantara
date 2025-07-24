"use client";

import { Assets } from "@/assets";
import Image from "next/image";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

export default function Faq() {
  return (
    <div className="relative h-full w-full">
      <div className="w-full pb-10">
        <div className="relative mt-10 h-[50vh] w-full overflow-hidden">
          <Image
            src={Assets.FAQ}
            alt="FAQ"
            fill
            className="absolute top-0 object-cover md:object-contain"
            priority={true}
            sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
            <div>
              <h2 className="font-domaine text-[36px] text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="w-[50%]">
              <p className="text-center font-josefins text-[28px] font-thin text-white">
                Do you need some help with something or do you have questions on
                some features?
              </p>
            </div>
          </div>
        </div>
        <div className="flex  w-full items-start justify-center py-14">
          <div className="w-full px-4">
            <div className="mx-auto w-full max-w-2xl rounded-[8px] bg-white p-2 shadow-sm">
              <Disclosure
                as="div"
                className=" border-b-[0.75px] border-gray-100"
              >
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/25 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-light text-[#C1AE94]">
                        How do i order and buy products of ECHO Nusantara?
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
                      <Disclosure.Panel className="my-2 rounded-[4px] px-4 py-4 text-[20px] text-gray-500 ">
                        <ul className="ml-4 list-disc">
                          <li className="py-1 text-left font-josefins text-[18px] font-thin text-[#231F20]">
                            Direct Order Via WhatsApp/SMS/Phone Call to our
                            Customer Service.
                          </li>
                          <li className="py-1 text-left font-josefins text-[18px] font-thin text-[#231F20]">
                            Via automatic ordering on this site
                          </li>
                          <li className="py-1 text-left font-josefins text-[18px] font-thin text-[#231F20]">
                            Via E-commerce Shoppe/Tokopedia/Tiktok of ECHO
                            Nusantara
                          </li>
                        </ul>
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
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/25 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-light text-[#C1AE94]">
                        What is the minimum order for ECHO Nusantara products?
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
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[20px] text-gray-500">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-thin text-[#231F20]">
                            No minimum order
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
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/25 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-light text-[#C1AE94]">
                        What is the standard delivery time for ECHO Nusantara
                        products?
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
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[20px] text-gray-500">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-thin text-[#231F20]">
                            Depends on the distance to your location. Usually
                            for Jabodetabek it takes 1 Day. For outside
                            Jabodetabek, it depends on the expedition service.
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
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/25 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-light text-[#C1AE94]">
                        Can i order dry bird nest only?
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
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[20px] text-gray-500">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-thin text-[#231F20]">
                            We not only sell ready to serve product from
                            swallow’s nest, but also swallow dry birdnest
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
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-[6px] bg-white px-4 py-2 hover:bg-[#C1AE94]/25 focus:outline-none focus-visible:ring focus-visible:ring-[#C1AE94]/25">
                      <h2 className="text-left font-josefins text-[20px] font-light text-[#C1AE94]">
                        What are the packages offered by ECHO Nusantara?
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
                      <Disclosure.Panel className="px-4 pb-2 pt-4 text-[20px] text-gray-500">
                        <div>
                          <h2 className="py-1 text-left font-josefins text-[18px] font-thin text-[#231F20]">
                            Ready to serve Hampers, Carton, Dry Birdnest 37.8g,
                            500g and can be up with your needs.
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
}
