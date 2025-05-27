"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Assets } from "@/assets";
import { ModalForceClose, NavHome } from "@/components";
import { useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Carousel from "react-multi-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

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

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showSymphony, setShowSymphony] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const maxScroll = 300;
  const opacityNusantara = Math.max(0, 1 - scrollPosition / maxScroll);

  useEffect(() => {
    const timer = setTimeout(() => setShowSymphony(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimer);
  }, []);

  const Letter: React.FC<{ translateX: number; children: any }> = ({
    translateX,
    children,
  }) => (
    <h2
      className="font-domaine text-[70px] font-medium text-white/60 transition-transform duration-1000 lg:text-[10rem]"
      style={{ transform: `translateX(${translateX}px)` }}
    >
      {children}
    </h2>
  );

  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const nextSlide = () => setStep((prev) => (prev + 1) % totalSteps);
  const prevSlide = () =>
    setStep((prev) => (prev - 1 + totalSteps) % totalSteps);
  const goToSlide = (index: number) => setStep(index);

  const products = [
    {
      image: Assets.Pandan,
      title: "Minuman Sarang Burung Walet - Rasa Pandan",
      subtitle: "Contains 3.5 Grams of Premium Bird's Nest",
      price: "Rp. 275.000",
      link: "/shop/minuman-sarang-burung-walet-rasa-pandan",
    },
    {
      image: Assets.Kurma,
      title: "Minuman Sarang Burung Walet - Rasa Kurma",
      subtitle: "Contains 3.5 Grams of Premium Bird's Nest",
      price: "Rp. 275.000",
      link: "/shop/minuman-sarang-burung-walet-rasa-kurma",
    },
    {
      image: Assets.Teja,
      title: "Teja Pandan - Minuman Sarang Burung Walet",
      subtitle: "Contains 3.5 Grams of Premium Bird's Nest",
      price: "Rp. 115.500",
      link: "/shop/teja-pandan-minuman-sarang-burung-walet",
    },
    {
      image: Assets.HampersPremium,
      title: "Minuman Sarang Burung Walet Hampers Premium",
      subtitle: "Contains 3.5 Grams of Premium Bird's Nest",
      price: "Rp 3.080.000",
      link: "/shop/minuman-sarang-burung-walet-hampers-premium-isi-8-botol",
    },
    {
      image: Assets.HampersA,
      title: "Minuman Sarang Burung Walet Hampers Deluxe A",
      subtitle: "Contains 3.5 Grams of Premium Bird's Nest",
      price: "Rp 3.850.000",
      link: "/shop/minuman-sarang-burung-walet-hampers-deluxe-a-8-botol-serat-kering",
    },
  ];

  return (
    <>
      <ModalForceClose session={session} />
      <main className="relative min-h-screen">
        <NavHome />
        {/* Section #1 */}
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute top-0 left-0 z-0 h-full w-full">
            <Image
              src={Assets.Home1}
              alt="Home"
              className="w-full h-full object-cover object-[20%_90%] md:object-[1%_90%] lg::object-[center_top]"
            />
          </div>
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 py-20 bg-[#F4F4F4]">
          <div className="w-full flex items-center justify-center flex-col gap-2">
            <h1 className="text-[52px] font-medium text-black font-domaine text-center">
              Our Best Selling Product
            </h1>
            <Link
              href="/shop"
              className="flex flex-row gap-2 items-center justify-center hover:no-underline appearance-none"
            >
              <h1 className="text-[16px] font-thin text-black font-domaine text-center">
                See All Product
              </h1>
              <Image src={Assets.ArrowRight} alt="Arrow Right" />
            </Link>
          </div>
          <div className="relative w-full">
            <div className="relative ml-4 lg:ml-20 mt-10">
              <Carousel
                responsive={{
                  superLargeDesktop: {
                    breakpoint: { max: 4000, min: 1024 },
                    items: 4.5,
                  },
                  desktop: { breakpoint: { max: 1024, min: 768 }, items: 4.5 },
                  tablet: { breakpoint: { max: 768, min: 464 }, items: 2.5 },
                  mobile: { breakpoint: { max: 464, min: 0 }, items: 1.4 },
                }}
                autoPlay={false}
                infinite
                partialVisible={false}
                itemClass="pr-2"
                containerClass="w-full h-[70vh]"
                className="w-full"
                customLeftArrow={<ChevronLeft size={24} />}
                customRightArrow={<ChevronRight size={24} />}
                customDot={<CustomDot />}
                showDots={true}
              >
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="w-full px-2"
                    onClick={() => router.push(product.link)}
                  >
                    <div className="relative h-[450px] w-full cursor-pointer shadow-product bg-transparent shadow-gray-100 group">
                      <div className="flex h-full w-full flex-col gap-2">
                        {/* Gambar produk */}
                        <div className="relative h-[18rem] w-full overflow-hidden rounded-[8px]">
                          <Image
                            src={product.image}
                            priority
                            className="w-full h-full object-cover"
                            alt={product.title}
                          />

                          {/* Tombol hover (desktop only) */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
                            <div className="flex gap-2 translate-y-6 group-hover:translate-y-0 transition-all duration-300 w-full px-4">
                              <button className="bg-white border border-[#B69B7C] text-black w-full text-sm rounded-full py-3 hover:bg-[#B69B7C] hover:text-white transition">
                                Add to Cart
                              </button>
                              <button className="bg-[#B69B7C] text-white w-full text-sm rounded-full py-3 hover:bg-white hover:text-black transition">
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Informasi produk */}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1 py-1">
                            <span className="font-domaine text-[18px] font-light text-black">
                              {product.title}
                            </span>
                            <span className="font-domaine text-[14px] text-black">
                              {product.subtitle}
                            </span>
                          </div>
                          <span className="font-josefins font-semibold text-[24px] text-[#B69B7C]">
                            {product.price}
                          </span>

                          {/* Tombol tampil langsung di mobile */}
                          <div className="flex flex-row md:hidden gap-2 mt-2">
                            <button className="bg-white border border-[#B69B7C] text-black w-full text-sm rounded-full py-3 hover:bg-[#B69B7C] hover:text-white transition">
                              Add to Cart
                            </button>
                            <button className="bg-[#B69B7C] text-white w-full text-sm rounded-full py-3 hover:bg-white hover:text-black transition">
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        {/* Video Section */}
        <div className="relative flex h-screen w-full justify-center items-center flex-col gap-4 lg:gap-14">
          <h1 className="text-[28px] lg:text-[52px] font-medium text-black font-domaine text-left">
            Why Choose Our Product
          </h1>
          <div className="group relative mx-auto flex h-full pb-20 md:pb-0 md:h-[70vh] w-full max-w-6xl flex-col items-center overflow-hidden px-4">
            <div className="relative w-full h-full md:h-[70vh] flex flex-col md:flex-row">
              {/* Teks Deskripsi */}
              <div className="relative w-full h-full md:w-1/2 md:h-full overflow-hidden">
                {[
                  "Sourced directly from nature, our offerings are purely organic. They exemplify nature's genuine authenticity. Only filtered water and organic rock sugar are used for some bottled products.",
                  "We prioritize sustainability and respect in our operations. We harvest only from empty nests and in a way that does not disturb nesting birds in the same area.",
                  "We stand against the use of any chemicals in our products. Our products are free of nitrates, heavy metals, chemical bleach and colouring agent, preservatives and pesticides.",
                  "We stand against the use of any chemicals in our products. Our products are free of nitrates, heavy metals, chemical bleach and colouring agent, preservatives and pesticides.",
                ].map((num, index) => (
                  <motion.div
                    key={index}
                    initial={
                      isMobile
                        ? { x: index * 100 + "%" }
                        : { y: index * 100 + "%" }
                    }
                    animate={
                      isMobile
                        ? { x: (index - step) * 100 + "%" }
                        : { y: (index - step) * 100 + "%" }
                    }
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 flex w-full h-full items-center justify-center text-[16px] text-center font-thin text-white"
                    style={{
                      backgroundColor: [
                        "#D5BD9F",
                        "#7D8699",
                        "#7D716A",
                        "#CDB698",
                      ][index],
                    }}
                  >
                    <div className="w-[60%]">{num}</div>
                  </motion.div>
                ))}
              </div>

              {/* Images */}
              <div className="relative w-full h-full md:w-1/2 md:h-full overflow-hidden">
                {[
                  Assets.Choose1,
                  Assets.Choose2,
                  Assets.Choose3,
                  Assets.Choose4,
                ].map((img, index) => (
                  <motion.div
                    key={index}
                    initial={
                      isMobile
                        ? { x: -index * 100 + "%" }
                        : { y: -index * 100 + "%" }
                    }
                    animate={
                      isMobile
                        ? { x: (step - index) * 100 + "%" }
                        : { y: (step - index) * 100 + "%" }
                    }
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 w-full h-full"
                  >
                    <Image
                      src={img}
                      alt={`Image ${index + 1}`}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-gray-800 p-2 text-white opacity-75 hover:opacity-100 group-hover:flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-gray-800 p-2 text-white opacity-75 hover:opacity-100 group-hover:flex"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="absolute z-[10] bottom-6 flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const isActive = step === i;
              return (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-3 w-8 bg-gradient-to-tr from-[#D5BD9F] to-[#9D846D]"
                      : "relative h-3 w-3 p-[1.5px]"
                  }`}
                  style={
                    !isActive
                      ? {
                          background:
                            "linear-gradient(to top right, #D5BD9F, #9D846D)",
                        }
                      : undefined
                  }
                >
                  {!isActive && (
                    <span className="block h-full w-full rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="relative h-full overflow-hidden flex justify-center w-full items-center py-4">
          <Image
            src={Assets.LogoEchoBlack}
            alt="Home"
            style={{
              objectFit: "cover",
              width: isMobile ? "50%" : "30%",
              height: isMobile ? "50%" : "30%",
            }}
          />
        </div>
        <div className="max-w-[50%] mx-auto w-full block lg:hidden">
          <h2 className="text-center font-domaine text-[24px]">
            Premium Quality Bird{"'"}s Nest
          </h2>
        </div>
        <div className="flex h-full py-8 lg:h-screen w-full items-center justify-center rounded-[4px] ">
          <video
            style={{
              objectFit: isMobile ? "contain" : "cover",
              width: "100%",
              height: "100%",
            }}
            src={require("../../../../public/video-aal.mp4")}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className="relative h-screen lg:h-[100vh] w-full flex items-center justify-center overflow-hidden">
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
              style={{ objectFit: "cover", width: "5%", height: "5%" }}
            />
            <div className="flex flex-col gap-4 justify-center items-center w-full h-full">
              <div className="flex flex-col justify-center items-center">
                <span className="text-[28px] lg:text-[64px] font-thin text-black font-domaine text-left">
                  SYMPHONY
                </span>
                <span className="text-[28px] lg:text-[64px] font-thin text-black font-domaine text-left">
                  OF NATURE
                </span>
              </div>
              <div className="px-4 lg:w-[50%]">
                <h2 className="text-[16px] lg:text-[24px] font-thin text-center text-black font-domaine leading-6 lg:leading-10">
                  At ECHO, we believe that when you respect the harmony of
                  nature
                  {"'"}s ecosystem, humans and nature can co-exist in a
                  beautiful symphony. We are born from nature, and ECHO seeks to
                  reestablish that innate connection
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* News */}
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 py-20">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between px-4 lg:px-20">
            <h1 className="text-[28px] lg:text-[52px] font-thin text-black font-domaine text-center">
              News & Updates
            </h1>
            <Link
              href="/news"
              className="flex flex-row gap-2 items-center justify-center hover:no-underline appearance-none"
            >
              <h1 className="text-[16px] font-thin text-black font-domaine text-center">
                See All Updates
              </h1>
              <Image src={Assets.ArrowRight} alt="Arrow Right" />
            </Link>
          </div>
          <div className="relative w-full h-screen">
            <div className="group relative ml-4 lg:ml-20 h-full flex justify-center items-center">
              <Carousel
                responsive={{
                  superLargeDesktop: {
                    breakpoint: { max: 4000, min: 1024 },
                    items: 1.5,
                  },
                  desktop: { breakpoint: { max: 1024, min: 768 }, items: 1.2 },
                  tablet: { breakpoint: { max: 768, min: 464 }, items: 1.5 },
                  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
                }}
                autoPlay
                infinite
                partialVisible={false}
                itemClass="pr-2"
                containerClass="w-full h-screen lg:h-[70vh]"
                className="w-full"
                customLeftArrow={<ChevronLeft size={24} />}
                customRightArrow={<ChevronRight size={24} />}
                customDot={<CustomDot />}
              >
                {products.map((product, index) => (
                  <div key={index} className="w-full px-4">
                    <div className="lg:h-[460px] h-full relative overflow-hidden w-full cursor-pointer shadow-product rounded-[16px] shadow-gray-100 lg:hover:scale-105 transition-all duration-900 group">
                      <div className="flex h-screen relative lg:h-full w-full flex-col lg:flex-row gap-2">
                        <div className="relative h-full w-[460px]">
                          <Image
                            src={product.image}
                            fill
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                            priority={true}
                            alt={product.title}
                          />
                        </div>
                        <div className="flex flex-col justify-center items-left relative gap-8 lg:h-full w-full lg:w-[50%] px-4 py-2">
                          <div className="w-full">
                            <div className="flex flex-col gap-1">
                              <span className="font-domaine uppercase text-[14px] font-light text-black">
                                Category
                              </span>
                              <span className="font-domaine text-[20px] lg:text-[28px] font-semibold text-black">
                                Lorem Ipsum is simply dummy text of the printing
                              </span>
                            </div>
                            <span className="font-domaine text-[16px] text-black">
                              It is a long established fact that a reader will
                              be distracted by the readable content of a page
                              when looking at its layout.
                            </span>
                          </div>
                          <div className="w-full flex justify-between items-center">
                            <span className="font-domaine text-[14px] font-light text-black">
                              1 May 2025
                            </span>
                            <button className="font-domaine text-[14px] rounded-full px-4 py-1 font-semibold text-[#B69B7C] ring-1 ring-[#7D716A] transition-colors duration-300 group-hover:bg-[#B69B7C] group-hover:text-white">
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </main>
    </>
    //   )}
    // </>
  );
}
