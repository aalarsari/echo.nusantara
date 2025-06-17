"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Assets } from "@/assets";
import {
  ButtonPrimary,
  FormatRupiah,
  ModalForceClose,
  NavHome,
} from "@/components";
import { useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Carousel from "react-multi-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { blog } from "@/types/blog/blog";
import moment from "moment";
import { GetBlog } from "@/controller/noAuth/blog";
import { getListShop } from "@/controller/noAuth/shop";
import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import { ProductController } from "@/controller/noAuth/product";

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

interface Discount {
  id: number;
  subject: string;
  discount: number;
  expireDate: string;
}

interface ProductItem {
  id: number;
  image1: string;
  name: string;
  slug: string;
  weight: number;
  descriptions: string;
  bestseller: boolean;
  priceIDR: number;
  Discount: Discount[];
  WishlistProduct: { id: number; productsId: number }[];
  subDescriptions: string;
}

interface BannerItem {
  id: number;
  path: string;
  subtitle: string;
  title: string;
  category: string;
}
export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showSymphony, setShowSymphony] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  var dispatch: AppDispatch = useDispatch();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const session = useSession();
  // const { data: session } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [news, setNewsData] = useState<{
    blog: blog[];
  }>({
    blog: [],
  });
  const [pageSize, setPageSize] = useState<number>(6);
  const [page, setPage] = useState<number>(1);
  const [productData, setProductData] = useState<ProductItem[]>([]);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [bannerData, setBannerData] = useState<BannerItem[]>([]);

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

  const nextSlide = () => setStep((prev) => (prev + 1) % totalSteps);
  const prevSlide = () =>
    setStep((prev) => (prev - 1 + totalSteps) % totalSteps);
  const goToSlide = (index: number) => setStep(index);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProductController();
        if (response.ok) {
          const result = await response.json();
          setBannerData(result?.data.benner || []);
          console.log(result?.data.benner, "banner");
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataBlog = async () => {
      try {
        const response = await GetBlog(page, pageSize);
        if (response.ok) {
          const result = await response.json();
          setNewsData(result?.data);
          console.log(result?.data, "dasda fadata");
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataBlog();
  }, [page, pageSize]);

  const handleProductClick = (slug: string) => {
    try {
      router.push(`/shop/${slug}`);
    } catch (error) {
      console.error("Error navigating to product detail:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListShop(pageSize, page, categoryId!);
        if (response.ok) {
          const result = await response.json();
          const { product, productTotal } = result.data;
          setProductData(product);
          console.log(product, "Product");
          setTotalPages(Math.ceil(productTotal / pageSize));
          const wishlistIds = result?.data.product
            .flatMap((product: ProductItem) => product.WishlistProduct)
            .map((wishlist: { productsId: any }) => wishlist.productsId);
          setLikedProducts(wishlistIds);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [page, pageSize, categoryId, session.status]);

  const filteredProducts = query
    ? productData.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
    : productData;

  const slides = [
    {
      title: "Purely Organic",
      description:
        "Sourced directly from nature, our offerings are purely organic. Only filtered water and organic rock sugar are used for some bottled products.",
      icon: Assets.IconNatural,
      image: Assets.Choose1,
      bg: "linear-gradient(to top right, #D5BD9F, #9D846D)",
    },
    {
      title: "Sustainable Harvesting",
      description:
        "We prioritize sustainability and respect in our operations. We harvest only from empty nests and in a way that does not disturb nesting birds.",
      icon: Assets.IconEthical,
      image: Assets.Choose2,
      bg: "linear-gradient(to bottom right, #7D716A, #5C4E45)",
    },
    {
      title: "Chemical-Free",
      description:
        "We stand against the use of any chemicals in our products. Our products are free of nitrates, heavy metals, bleach, coloring, and pesticides.",
      icon: Assets.IconChemical,
      image: Assets.Choose3,
      bg: "linear-gradient(to bottom right, #7D8699, #5B6475)",
    },
  ];

  const totalSteps = slides.length;

  return (
    <>
      <ModalForceClose session={session} />
      <main className="relative min-h-screen">
        {/* Section #1 */}
        {bannerData.filter((item) => item.category === "Products").length >
          0 && (
          <div className="relative h-screen w-full overflow-hidden ">
            <div
              className="flex h-screen items-center justify-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
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
                className="h-full w-full"
                customDot={<CustomDot />}
              >
                {bannerData
                  .filter((bannerItem) => bannerItem.category === "Products")
                  .map((bannerItem, index) => (
                    <div
                      key={index}
                      className="flex h-[100vh] items-center justify-center"
                    >
                      <div className="relative h-[100%] w-full">
                        <Image
                          src={bannerItem.path}
                          alt={bannerItem.title}
                          fill
                          style={{ objectFit: "cover" }}
                          priority={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  ))}
              </Carousel>
            </div>
          </div>
        )}
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
                containerClass="w-full h-[100vh] lg:h-[100vh]"
                className="w-full"
                customLeftArrow={<ChevronLeft size={24} />}
                customRightArrow={<ChevronRight size={24} />}
                customDot={<CustomDot />}
                showDots={true}
              >
                {filteredProducts
                  .filter((product) => product.bestseller === true)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="w-full px-2"
                      onClick={() => handleProductClick(product.slug)}
                    >
                      <div className="relative h-[600px] lg:h-[480px] w-full cursor-pointer shadow-product bg-transparent shadow-gray-100 group">
                        <div className="flex h-full w-full flex-col gap-2">
                          {/* Gambar produk */}
                          <div className="relative h-[30rem] w-full overflow-hidden rounded-[8px]">
                            <Image
                              src={product.image1}
                              alt={product.name}
                              fill
                              priority
                              style={{ objectFit: "cover" }}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {/* Tombol hover (desktop only) */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
                              <div className="flex gap-2 translate-y-6 group-hover:translate-y-0 transition-all duration-300 w-full px-4">
                                <button
                                  onClick={() =>
                                    handleProductClick(product.slug)
                                  }
                                  className="bg-white border border-[#B69B7C] text-black w-full text-sm rounded-full py-3 hover:bg-[#B69B7C] hover:text-white transition"
                                >
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() =>
                                    handleProductClick(product.slug)
                                  }
                                  className="bg-[#B69B7C] text-white w-full text-sm rounded-full py-3 hover:bg-white hover:text-black transition"
                                >
                                  Buy Now
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Informasi produk */}
                          <div className="flex flex-col justify-between h-[50%] lg:h-[40%]">
                            <div className="flex flex-col gap-1 py-1">
                              <span className="font-domaine text-[16px] lg:text-[18px] font-semibold text-black">
                                {product.name}
                              </span>
                              <span className="font-domaine text-[12px] lg:text-[14px] text-black">
                                {product.subDescriptions}
                              </span>
                            </div>
                            <div className="relative flex w-full flex-row items-center">
                              <div>
                                <span className="font-josefins text-[20px] lg:text-[28px] font-semibold text-[#B69B7C]">
                                  {product.Discount?.length > 0 ? (
                                    <div className="flex flex-row gap-2">
                                      <span className="ml-2 text-red-500 line-through">
                                        <FormatRupiah
                                          price={product.priceIDR || 0}
                                        />
                                      </span>
                                      <FormatRupiah
                                        price={
                                          product.priceIDR -
                                          product.priceIDR *
                                            (product.Discount[0]?.discount || 0)
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <FormatRupiah
                                      price={product.priceIDR || 0}
                                    />
                                  )}
                                </span>
                              </div>
                              {product.Discount?.[0]?.discount && (
                                <div className="absolute -top-10 animate-bounce rounded bg-red-500 p-1 text-[16px] lg:text-[18px] text-white">
                                  {`${(product.Discount[0].discount * 100).toFixed(0)}%`}
                                </div>
                              )}
                            </div>

                            {/* Tombol tampil langsung di mobile */}
                            <div className="flex flex-row md:hidden gap-2 mt-2">
                              <button
                                onClick={() => handleProductClick(product.slug)}
                                className="bg-white border border-[#B69B7C] text-black w-full text-sm rounded-full py-3 hover:bg-[#B69B7C] hover:text-white transition"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => handleProductClick(product.slug)}
                                className="bg-[#B69B7C] text-white w-full text-sm rounded-full py-3 hover:bg-white hover:text-black transition"
                              >
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
              <div className="relative w-full h-full md:w-1/2 md:h-full overflow-hidden">
                {slides.map((slide, index) => (
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
                    className="absolute top-0 left-0 flex w-full h-full items-center justify-center text-white px-6"
                    style={{ background: slide.bg }}
                  >
                    <div className="flex flex-col items-center text-center gap-4 max-w-md">
                      <Image
                        src={slide.icon}
                        alt={slide.title}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                      <h3 className="text-xl md:text-[30px] font-semibold font-domaine">
                        {slide.title}
                      </h3>
                      <p className="text-sm md:text-[16px] font-light">
                        {slide.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Images */}
              <div className="relative w-full h-full md:w-1/2 md:h-full overflow-hidden">
                {slides.map((slide, index) => (
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
                      src={slide.image}
                      alt={`Slide ${index + 1}`}
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
              <div className="flex flex-col lg:gap-4 justify-start items-start">
                <div className="relative w-[250px] h-[50px] lg:w-[400px] lg:h-[70px]">
                  <Image src={Assets.Symphonyy} alt="Symphony" fill />
                </div>
                <div className="relative w-[250px] h-[50px] lg:w-[400px] lg:h-[70px]">
                  <Image src={Assets.OffNature} alt="Symphony" fill />
                </div>
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
              <ButtonPrimary
                onClick={() => router.push("/contact")}
                text="Contact Us"
                width="w-[200px]"
                height="h-[50px]"
              />
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
                {news.blog && news.blog.length > 0 ? (
                  news.blog.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(`/news/${item.slug}`)}
                      className="w-full px-4"
                    >
                      <div className="lg:h-[460px] h-full relative overflow-hidden w-full cursor-pointer shadow-product rounded-[16px] shadow-gray-100 lg:hover:scale-105 transition-all duration-900 group">
                        <div className="flex h-screen relative lg:h-full w-full flex-col lg:flex-row gap-2">
                          <div className="relative h-full w-[460px]">
                            <Image
                              src={item.image?.[0] || Assets.DefaultImage}
                              fill
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }}
                              priority={true}
                              alt={item.title}
                            />
                          </div>
                          <div className="flex flex-col justify-center items-left relative gap-8 lg:h-full w-full lg:w-[50%] px-4 py-2">
                            <div className="w-full">
                              <div className="flex flex-col gap-1">
                                <span className="font-domaine uppercase text-[14px] font-light text-black">
                                  {item.category?.name ?? "No Category"}
                                </span>
                                <span className="font-domaine text-[20px] lg:text-[28px] font-semibold text-black">
                                  {item.title}
                                </span>
                              </div>
                              <span className="font-domaine text-[16px] text-black">
                                {item.subtitle}
                              </span>
                            </div>
                            <div className="w-full flex justify-between items-center">
                              <div className="flex flex-row gap-2 items-center">
                                <Image
                                  src={Assets.TimeBronze}
                                  alt="time-bronze"
                                  width={16}
                                  height={16}
                                />
                                <span className="font-domaine text-[14px] font-light text-[#B69B7C]">
                                  {moment(item.updateAt).format("DD MMMM YYYY")}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  router.push(`/news/${item.slug}`)
                                }
                                className="font-domaine text-[14px] rounded-full px-4 py-1 font-semibold text-[#B69B7C] ring-1 ring-[#B69B7C] transition-colors duration-300 group-hover:bg-[#B69B7C] group-hover:text-white"
                              >
                                Read More
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 col-span-full">
                    No blog posts found.
                  </div>
                )}
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
