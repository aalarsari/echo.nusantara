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

interface Feature {
  icon: StaticImageData;
  title: string;
  text: string;
}

interface HoveredImageProps {
  src: StaticImageData;
  alt: string;
  width: number;
  height: number;
  overlayColor: string;
  onClick: () => void;
}

interface ModalContent {
  title: string;
  text: string;
  subtitle?: string;
  link?: string;
  color?: string;
}

const HoveredImage: React.FC<HoveredImageProps> = ({
  src,
  alt,
  width,
  height,
  overlayColor,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="relative transform cursor-pointer transition duration-700 ease-in-out hover:scale-105"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-700 hover:opacity-100 ${overlayColor}`}
      >
        {overlayColor === "bg-[#7b8f6e]" && (
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-[7rem]">
            <div>
              <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center font-domaine text-[30px] leading-[2.25rem] tracking-[0.5rem] text-black transition duration-700">
                ECHOING KINDNESS
              </h2>
            </div>
            <span className="relative h-[1px] w-[7rem] bg-black"></span>
          </div>
        )}
        {overlayColor === "bg-[#8899ad]" && (
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-[7rem]">
            <div>
              <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center font-domaine text-[30px] leading-[2.25rem] tracking-[0.5rem] text-black transition duration-700">
                RESONATING SYMPHONY
              </h2>
            </div>
            <span className="relative h-[1px] w-[7rem] bg-black"></span>
          </div>
        )}
        {overlayColor === "bg-[#c3b199]" && (
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-[7rem]">
            <div>
              <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center font-domaine text-[30px] leading-[2.25rem] tracking-[0.5rem] text-black transition duration-700">
                THE PERFECT ECOSYSTEM
              </h2>
            </div>
            <span className="relative h-[1px] w-[7rem] bg-black"></span>
          </div>
        )}
      </div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  );
};

const Modal: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  content: ModalContent | null;
}> = ({ isOpen, closeModal, content }) => {
  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-[999999]">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 lg:px-24 lg:py-10">
        {content && (
          <>
            <div
              className={`relative flex h-full w-full rounded-sm ${[content.color]} p-4`}
            >
              <div className="flex h-full w-full flex-col items-center justify-center gap-8 border border-black">
                <div className="relative flex flex-col items-center justify-center gap-4">
                  <div className="w-full">
                    <h2 className="transform text-center font-domaine text-[18px] leading-[2.25rem] tracking-[0.5rem] text-black transition duration-700 lg:text-[30px]">
                      {content.title}
                    </h2>
                  </div>
                  <span className="relative h-[2px] w-[5rem] bg-black"></span>
                </div>
                <div className="w-[80%]">
                  <p className="text-md text-center font-josefins font-thin lg:text-[32px]">
                    {content.text}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-md text-center font-josefins font-thin lg:text-[32px]">
                    {content.subtitle}
                  </p>
                  {content.link && (
                    <a
                      href={content.link}
                      target="_blank"
                      className="text-md cursor-pointer text-center font-josefins font-thin outline-none lg:text-[32px]"
                    >
                      {content.link || "Learn More"}
                    </a>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="absolute right-8 top-4 rounded py-2 font-josefins text-black outline-none"
                >
                  <XMarkIcon className="text-blac h-8 w-8 outline-none" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <button
        onClick={closeModal}
        aria-label="Close"
        className="mt-4 w-full rounded bg-red-500 py-2 text-white"
      >
        Close
      </button>
    </Dialog>
  );
};

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showSymphony, setShowSymphony] = useState(true);
  const [isMerahHovered, setIsMerahHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

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

  const features: Feature[] = [
    {
      icon: Assets.IconEthical,
      title: "Ethical Harvesting",
      text: "We prioritize sustainability and respect in our operations. We harvest only from empty nests and in a way that does not disturb nesting birds in the same area.",
    },
    {
      icon: Assets.IconGrade,
      title: "AAA GRADE QUALITY",
      text: "Our products embody superior quality, excelling in size, color, and density. They consistently meet AAA grade standards, symbolizing excellence in the market and enjoying significant respect in Indonesia.",
    },
    {
      icon: Assets.IconNatural,
      title: "NATURAL AND ORGANIC",
      text: "Sourced directly from nature, our offerings are purely organic. They exemplify nature's genuine authenticity. Only filtered water and organic rock sugar are used for some bottled products.",
    },
    {
      icon: Assets.IconChemical,
      title: "NO CHEMICALS USED",
      text: "We stand against the use of any chemicals in our products. Our products are free of nitrates, heavy metals, chemical bleach and colouring agent, preservatives and pesticides.",
    },
    {
      icon: Assets.IconForest,
      title: "Incomparable Quality",
      text: "Echo Nusantara's bird's nests are created by the swiflets that inhabit an undisturbed 174,000 hectare pristine forset in East Kalimantan.",
    },
    {
      icon: Assets.IconCommit,
      title: "COMMITMENT TO CONSERVATION",
      text: "Conservation is more than just an ideal for us. It's a deep commitment that influences every action we take. We invest in supporting a wide range of indigenous animals, including the endangered Orangutans.",
    },
  ];

  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const nextSlide = () => setStep((prev) => (prev + 1) % totalSteps);
  const prevSlide = () =>
    setStep((prev) => (prev - 1 + totalSteps) % totalSteps);
  const goToSlide = (index: number) => setStep(index);

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
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        </div>
        {/* Video Section */}
        <div className="flex h-screen w-full justify-center items-center flex-col gap-14">
          <h1 className="text-[52px] font-thin text-black font-domaine text-left">
            Why Choose Our Product
          </h1>
          <div className="group relative mx-auto flex h-[70vh] w-full max-w-6xl flex-col items-center overflow-hidden">
            {/* Container utama */}
            <div className="relative flex h-[70vh] w-full">
              {/* Bagian kiri (1 → 3 → 5) */}
              <div className="relative h-full w-1/2 overflow-hidden">
                {[
                  "Sourced directly from nature, our offerings are purely organic. They exemplify nature's genuine authenticity. Only filtered water and organic rock sugar are used for some bottled products.",
                  "We prioritize sustainability and respect in our operations. We harvest only from empty nests and in a way that does not disturb nesting birds in the same area.",
                  "We stand against the use of any chemicals in our products. Our products are free of nitrates, heavy metals, chemical bleach and colouring agent, preservatives and pesticides.",
                  "We stand against the use of any chemicals in our products. Our products are free of nitrates, heavy metals, chemical bleach and colouring agent, preservatives and pesticides.",
                ].map((num, index) => (
                  <motion.div
                    key={num}
                    initial={{ y: index * 100 + "%" }}
                    animate={{ y: (index - step) * 100 + "%" }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-0 flex h-[70vh] w-full items-center justify-center text-[16px] text-center font-thin text-white"
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

              {/* Bagian kanan (2 → 4 → 6) dengan gambar */}
              <div className="relative h-full w-1/2 overflow-hidden">
                {[
                  Assets.Choose1,
                  Assets.Choose2,
                  Assets.Choose3,
                  Assets.Choose4,
                ].map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: -index * 100 + "%" }}
                    animate={{ y: (step - index) * 100 + "%" }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-0 h-[70vh] w-full"
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

            {/* Tombol Navigasi */}
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

            {/* Indikator Dots */}
            <div className="absolute bottom-4 flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`rounded-full bg-gray-800 transition-all ${
                    step === i ? "h-3 w-8" : "h-3 w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="relative h-full overflow-hidden flex justify-center w-full items-center py-4">
          <Image
            src={Assets.LogoEchoBlack}
            alt="Home"
            style={{ objectFit: "cover", width: "40%", height: "40%" }}
          />
        </div>
        <div className="flex h-screen w-full items-center justify-center rounded-[4px] ">
          <video
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            src={require("../../../../public/video-aal.mp4")}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
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
            <div className="flex flex-col gap-4 justify-center items-center w-full h-full">
              <h1 className="text-[64px] font-thin text-black font-domaine text-left">
                SYMPHONY
              </h1>
              <h1 className="text-[64px] font-thin text-black font-domaine text-left">
                OF NATURE
              </h1>
              <div className="w-[50%]">
                <h2 className="text-[24px] font-thin text-center text-black font-domaine">
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
        {/* Features Section */}

        {/* Section */}
      </main>
    </>
    //   )}
    // </>
  );
}
