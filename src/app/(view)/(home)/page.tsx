"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Assets } from "@/assets";
import { ModalForceClose, NavHome } from "@/components";
import { useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Carousel from "react-multi-carousel";
import {
  CustomArrowLeft,
  CustomArrowRight,
  CustomDot,
} from "@/components/atoms/ButtomCustom";

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

  const handleMerahMouseEnter = () => {
    setIsMerahHovered(true);
  };

  const handleMerahMouseLeave = () => {
    setIsMerahHovered(false);
  };

  const openModal = (content: ModalContent) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

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

  const translateX_E = -scrollPosition / 1.5;
  const translateX_C = -scrollPosition / 3;
  const translateX_H = scrollPosition / 3;
  const translateX_O = scrollPosition / 1.5;
  const translateX_Image = scrollPosition / 1.5;

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

  const symphonyLetters = ["S", "Y", "M", "P", "H", "O", "N", "Y"];
  const ofLetters = ["OF"];
  const natureLetters = ["N", "A", "T", "U", "R", "E"];

  const letterSizes = {
    H: { width: 50, height: 50 },
    O: { width: 50, height: 50 },
    E: { width: 50, height: 50 },
    default: { width: 64, height: 64 },
  };

  return (
    <>
      <ModalForceClose session={session} />
      <main className="relative min-h-screen">
        <NavHome />
        {/* Section #1 */}
        <div className="relative min-h-screen overflow-hidden">
          <div
            className={`layer-bg -translate-z-[55px] duration-500"} scale-[1.06] bg-layer-10 bg-no-repeat transition-opacity`}
          >
            {showSymphony ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center px-10 lg:px-20">
                <Image
                  src={Assets.Symphony}
                  alt="Symphony"
                  width={1000}
                  height={1000}
                />
              </div>
            ) : (
              <div className="animate-echo relative flex flex-col items-center justify-center gap-8 px-[4rem] lg:gap-4">
                <div className="relative flex flex-row gap-2">
                  <Letter translateX={translateX_E}>
                    <Image src={Assets.E} alt="E" width={120} height={120} />
                  </Letter>
                  <Letter translateX={translateX_C}>
                    <Image src={Assets.C} alt="C" width={120} height={120} />
                  </Letter>
                  <Letter translateX={translateX_H}>
                    <Image src={Assets.H} alt="H" width={120} height={120} />
                  </Letter>
                  <Letter translateX={translateX_O}>
                    <Image src={Assets.O} alt="O" width={120} height={120} />
                  </Letter>
                  <div
                    className="absolute -right-10 lg:-right-10 lg:top-0"
                    style={{
                      transform: `translateX(${translateX_Image}px)`,
                    }}
                  >
                    <Image
                      src={Assets.IconMini}
                      alt="Logo Mini"
                      width={36}
                      height={36}
                    />
                  </div>
                </div>
                <div
                  style={{ opacity: opacityNusantara }}
                  className="absolute -bottom-12 h-[1.5rem] w-full lg:-bottom-16"
                >
                  <Image
                    src={Assets.Nusantara}
                    alt="Echo Nusantara"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex h-[25vh] w-full items-center justify-center bg-white">
          <h2 className="text-center font-domaine text-2xl font-medium tracking-[0.5rem] text-black">
            PREMIUM QUALITY BIRD{"'"}S NEST
          </h2>
        </div>
        <div
          className="relative h-[40vh] w-full lg:h-[75vh]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Carousel
            autoPlay={true}
            autoPlaySpeed={1000}
            infinite={true}
            draggable
            focusOnSelect
            arrows={isHovered}
            responsive={{
              desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 1,
                partialVisibilityGutter: 40,
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
            showDots
            itemClass="w-full lg:w-[100vh]"
            className="h-[30vh] lg:h-[80vh]"
            customDot={<CustomDot onClick={() => null} active />}
            customLeftArrow={
              <CustomArrowLeft onClick={() => null} isHovered={isHovered} />
            }
            customRightArrow={
              <CustomArrowRight onClick={() => null} isHovered={isHovered} />
            }
          >
            {[
              "Landing1",
              "Landing2",
              "Landing3",
              "Landing4",
              "Landing5",
              "Landing6",
            ].map((image, index) => (
              <Image
                key={index}
                src={Assets[image as keyof typeof Assets]}
                alt={image}
              />
            ))}
          </Carousel>
        </div>
        {/* Video Section */}
        <div className="flex h-[30vh] w-full items-center justify-center rounded-[4px] md:h-[120vh] md:p-[6rem] lg:h-[120vh] lg:p-[12rem]">
          <video
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            src={require("../../../../public/video-aal.mp4")}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        {/* Features Section */}
        <div className="flex h-full w-full items-center justify-center gap-4 py-4">
          <div className="gap-[2rem] lg:grid lg:grid-cols-3">
            {features.map(({ icon, title, text }, index) => (
              <div
                key={index}
                className="flex w-full items-start justify-center overflow-hidden rounded-[4px] bg-white px-2 md:relative md:w-[70vh] lg:h-[60vh] lg:w-[50vh]"
              >
                <div className="flex flex-col items-center gap-4">
                  <Image src={icon} alt={title} width={100} height={100} />
                  <div className="flex w-full flex-col items-center gap-2 bg-white">
                    <div className="w-full">
                      <h2 className="text-center font-domaine text-2xl uppercase tracking-[0.25rem]">
                        {title}
                      </h2>
                    </div>
                    <span className="z-[5] text-center font-josefins text-[20px] font-light">
                      {text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section */}
        <div className="hidden lg:block">
          <div className="relative flex h-[210vh] w-full items-center justify-center py-4">
            <div className="absolute top-[6em]">
              <h2 className="font-domaine text-4xl font-medium tracking-[0.75rem]">
                SYMPHONY of NATURE
              </h2>
            </div>
            <div className="w-[45%]">
              <h2 className="text-center font-domaine text-[1.275rem] font-thin leading-[3rem] tracking-[2px]">
                At ECHO, we believe that when you respect the harmony of nature
                {"'"}s ecosystem, humans and nature can co-exist in a beautiful
                symphony. We are born from nature, and ECHO seeks to reestablish
                that innate connection
              </h2>
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="2000"
              className="absolute right-[0rem] top-[12rem] w-80"
            >
              <HoveredImage
                src={Assets.OrangUtan}
                alt="Orangutan"
                width={280}
                height={280}
                overlayColor="bg-[#7b8f6e]"
                onClick={() =>
                  openModal({
                    title: "ECHOING KINDNESS",
                    text: "Conservation is more than just an ideal for us. It's a deep commitment that influences every action we take. We invest in supporting a wide range of conservation initiatives, including the protection of endangered species like the Orangutans",
                    subtitle: "For more info please visit,",
                    link: "https://www.yad.or.id/photo-gallery",
                    color: "bg-[#7b8f6e]",
                  })
                }
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="2000"
              className="absolute left-[1rem] top-[24rem] w-80"
            >
              <HoveredImage
                src={Assets.Pabrik}
                alt="Pabrik"
                width={280}
                height={280}
                overlayColor="bg-[#8899ad]"
                onClick={() =>
                  openModal({
                    title: "RESONATING SYMPHONY",
                    text: "Our product is one that echoes with tranquillity and harmony. It's cultivated only from vacant nests, adhering to a cycle that respects and preserves the natural rhythms of our swiftlet inhabitants. This thoughtful balance between consumption and conservation reverberates a beautiful symphony - one that sings of respect for nature and peace of mind for you.",
                    color: "bg-[#8899ad]",
                  })
                }
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="2000"
              className="absolute bottom-[11rem] right-[2rem] h-[16rem] w-[30rem]"
              onMouseEnter={handleMerahMouseEnter}
              onMouseLeave={handleMerahMouseLeave}
            >
              <div
                className={`relative h-full w-full transition-transform duration-700 ${isMerahHovered ? "scale-105" : ""}`}
                onClick={() =>
                  openModal({
                    title: "A RESONANT REJUVINATION",
                    text: "Packed with an array of potent nutrients, ECHO's bird's nest products stand out for their naturally high sialic acid content, known for its immune-enhancing properties. These also contain collagen, a key component for skin elasticity and hydration. Present too is estradiol, which plays a vital role in enhancing skin health. Vitamin E and Vitamin B complex, as well as amino acids, minerals, and trace elements further enhance the product's health and beauty benefits.",
                    color: "bg-[#c9968e]",
                  })
                }
              >
                <Image
                  src={Assets.Merah}
                  alt="Merah"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {isMerahHovered && (
                  <div className="relative flex h-full w-full flex-col items-center justify-center gap-[7rem] bg-[#c9968e] transition-transform duration-700">
                    <div>
                      <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center font-domaine text-[30px] leading-[2.25rem] tracking-[0.5rem] text-black transition duration-700">
                        A RESONANT REJUVINATION
                      </h2>
                    </div>
                    <span className="relative h-[1px] w-[7rem] bg-black"></span>
                  </div>
                )}
              </div>
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="2000"
              className="absolute bottom-[3rem] left-[8rem] w-80"
            >
              <HoveredImage
                src={Assets.Batang}
                alt="Batang"
                width={280}
                height={280}
                overlayColor="bg-[#c3b199]"
                onClick={() =>
                  openModal({
                    title: "THE PERFECT ECOSYSTEM",
                    text: "Nestled deep in the Kalimantan rainforest, we have meticulously safeguarded a clean and pure environment spanning 173,000 hectares. This haven is carefully isolated from pesticides and heavy industry, offering an ideal habitat for our nesting swiftlets. Human interactions are minimized, mitigating stress on the birds, and thousands of trees are replanted, sustaining a flourishing ecosystem. This sanctuary is not only protected but thriving under our careful stewardship.",
                    color: "bg-[#c3b199]",
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="block lg:hidden">
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 py-10">
            <div className="">
              <h2 className="text-center font-domaine text-2xl font-medium tracking-[0.75rem]">
                SYMPHONY of NATURE
              </h2>
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="2000"
              className="flex items-center justify-center"
            >
              <HoveredImage
                src={Assets.OrangUtan}
                alt="Orangutan"
                width={280}
                height={280}
                overlayColor="bg-[#7b8f6e]"
                onClick={() =>
                  openModal({
                    title: "ECHOING KINDNESS",
                    text: "Conservation is more than just an ideal for us. It's a deep commitment that influences every action we take. We invest in supporting a wide range of conservation initiatives, including the protection of endangered species like the Orangutans",
                    subtitle: "For more info please visit,",
                    link: "https://www.yad.or.id/photo-gallery",
                    color: "bg-[#7b8f6e]",
                  })
                }
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="2000"
              className="h-[16rem] w-full"
              onMouseEnter={handleMerahMouseEnter}
              onMouseLeave={handleMerahMouseLeave}
            >
              <div
                className={`relative h-full w-full transition-transform duration-700 ${isMerahHovered ? "scale-105" : ""}`}
                onClick={() =>
                  openModal({
                    title: "A RESONANT REJUVINATION",
                    text: "Packed with an array of potent nutrients, ECHO's bird's nest products stand out for their naturally high sialic acid content, known for its immune-enhancing properties. These also contain collagen, a key component for skin elasticity and hydration. Present too is estradiol, which plays a vital role in enhancing skin health. Vitamin E and Vitamin B complex, as well as amino acids, minerals, and trace elements further enhance the product's health and beauty benefits.",
                    color: "bg-[#c9968e]",
                  })
                }
              >
                <Image
                  src={Assets.Merah}
                  alt="Merah"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {isMerahHovered && (
                  <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#c9968e] transition-transform duration-700">
                    <div>
                      <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center font-domaine text-[30px] leading-[2.25rem] tracking-[0.5rem] text-black transition duration-700">
                        A RESONANT REJUVINATION
                      </h2>
                    </div>
                    <span className="relative h-[1px] w-[7rem] bg-black"></span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full px-10">
              <h2 className="text-center font-domaine text-[1.275rem] font-thin leading-[3rem] tracking-[2px]">
                At ECHO, we believe that when you respect the harmony of nature
                {"'"}s ecosystem, humans and nature can co-exist in a beautiful
                symphony. We are born from nature, and ECHO seeks to reestablish
                that innate connection
              </h2>
            </div>
            <div className="flex w-full items-center justify-center">
              <HoveredImage
                src={Assets.Pabrik}
                alt="Pabrik"
                width={280}
                height={280}
                overlayColor="bg-[#8899ad]"
                onClick={() =>
                  openModal({
                    title: "RESONATING SYMPHONY",
                    text: "Our product is one that echoes with tranquillity and harmony. It's cultivated only from vacant nests, adhering to a cycle that respects and preserves the natural rhythms of our swiftlet inhabitants. This thoughtful balance between consumption and conservation reverberates a beautiful symphony - one that sings of respect for nature and peace of mind for you.",
                    color: "bg-[#8899ad]",
                  })
                }
              />
            </div>

            <div className="flex w-full items-center justify-center">
              <HoveredImage
                src={Assets.Batang}
                alt="Batang"
                width={280}
                height={280}
                overlayColor="bg-[#c3b199]"
                onClick={() =>
                  openModal({
                    title: "THE PERFECT ECOSYSTEM",
                    text: "Nestled deep in the Kalimantan rainforest, we have meticulously safeguarded a clean and pure environment spanning 173,000 hectares. This haven is carefully isolated from pesticides and heavy industry, offering an ideal habitat for our nesting swiftlets. Human interactions are minimized, mitigating stress on the birds, and thousands of trees are replanted, sustaining a flourishing ecosystem. This sanctuary is not only protected but thriving under our careful stewardship.",
                    color: "bg-[#c3b199]",
                  })
                }
              />
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          content={modalContent}
        />
      </main>
    </>
    //   )}
    // </>
  );
}
