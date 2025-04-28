"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartOutlineIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import { getListShop } from "@/controller/noAuth/shop";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { decrementWishlist, incrementWishlist } from "@/lib/redux/pinCount";
import { z } from "zod";
import { Wishlist } from "@/controller/user/wishlist";
import { Listbox, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductValidation } from "@/lib/zod-schema/product";
import { Controller, useForm } from "react-hook-form";
import { GetCategory } from "@/controller/noAuth/category";
import { Assets } from "@/assets";
import { useSearchParams } from "next/navigation";
import { FormatRupiah } from "@/components";
import { ProductController } from "@/controller/noAuth/product";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  CustomArrowLeft,
  CustomArrowRight,
  CustomDot,
} from "@/components/atoms/ButtomCustom";

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
  priceIDR: number;
  Discount: Discount[];
  WishlistProduct: { id: number; productsId: number }[];
  subDescriptions: string;
}

interface Category {
  id: number;
  name: string;
}

interface BannerItem {
  id: number;
  path: string;
  subtitle: string;
  title: string;
  category: string;
}

export default function Shop() {
  const [productData, setProductData] = useState<ProductItem[]>([]);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isHovered, setIsHovered] = useState<boolean>(false);

  var dispatch: AppDispatch = useDispatch();

  const session = useSession();
  type Products = z.infer<typeof ProductValidation>;
  const { control } = useForm<Products>({
    resolver: zodResolver(ProductValidation),
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [bannerData, setBannerData] = useState<BannerItem[]>([]);

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

  const handleProductClick = (slug: string) => {
    try {
      router.push(`/shop/${slug}`);
    } catch (error) {
      console.error("Error navigating to product detail:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetCategory();
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleWishlistClick = async (productId: number) => {
    try {
      const wishlistData = { productId };
      const isLiked = likedProducts.includes(productId);
      if (isLiked) {
        setLikedProducts(likedProducts.filter((id) => id !== productId));
        const response = await Wishlist(wishlistData);
        if (!response.ok) {
          throw new Error("Failed to update wishlist");
        }
      } else {
        setLikedProducts([...likedProducts, productId]);
        const response = await Wishlist(wishlistData);
        if (!response.ok) {
          throw new Error("Failed to update wishlist");
        }
      }
      dispatch(isLiked ? decrementWishlist(1) : incrementWishlist(1));
    } catch (error) {
      console.error("Error handling wishlist:", error);
    }
  };

  const filteredProducts = query
    ? productData.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      )
    : productData;

  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-10 px-8 py-16 md:px-20">
      {bannerData.filter((bannerItem) => bannerItem.category === "Discount")
        .length > 0 && (
        <div className="relative mt-10 h-[45vh] w-full overflow-hidden rounded-xl">
          <div
            className="flex h-[45vh] items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Carousel
              additionalTransfrom={0}
              arrows={isHovered}
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
              className="h-[80vh] w-full"
              customDot={<CustomDot onClick={() => null} active={true} />}
              customLeftArrow={
                <CustomArrowLeft onClick={() => null} isHovered={isHovered} />
              }
              customRightArrow={
                <CustomArrowRight onClick={() => null} isHovered={isHovered} />
              }
            >
              {bannerData
                .filter((bannerItem) => bannerItem.category === "Discount")
                .map((bannerItem, index) => (
                  <div key={index}>
                    <div className="flex h-[100vh] items-center justify-center">
                      <div className="relative h-[100%] w-full bg-black">
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
                  </div>
                ))}
            </Carousel>
          </div>
        </div>
      )}

      <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-[4rem]">
        <div className="relative flex h-full w-full flex-col gap-4">
          <Controller
            control={control}
            name="categoryId"
            rules={{ required: "Please select an option" }}
            render={({ field }) => (
              <Listbox
                value={selectedCategory}
                onChange={(selectedCategory) => {
                  setSelectedCategory(selectedCategory);
                  setCategoryId(selectedCategory?.id || null);
                  field.onChange(selectedCategory?.id || null);
                  setPage(1);
                }}
              >
                {({ open }) => (
                  <>
                    <div className="relative">
                      <Listbox.Button className="flex w-full cursor-pointer items-center justify-between rounded-md bg-white px-4 py-3 text-left text-gray-500 ring-[0.05rem] ring-gray-400 focus:ring-[0.05rem] focus:ring-[#C1AE94] sm:text-sm md:w-[11rem]">
                        <span>
                          {selectedCategory
                            ? selectedCategory.name.toUpperCase()
                            : "Filter"}
                        </span>
                        <AdjustmentsVerticalIcon
                          className={`h-5 w-5`}
                          aria-hidden="true"
                        />
                      </Listbox.Button>
                      <Transition
                        show={open}
                        enter="transition duration-300 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-300 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Listbox.Options
                          className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm md:w-[11rem]"
                          style={{ display: open ? "block" : "none" }}
                        >
                          {/* "All" option */}
                          <Listbox.Option
                            key={0}
                            value={null} // Null value for "All" selection
                            className={({ active }) =>
                              `${active ? "bg-[#C1AE94] text-white" : "text-gray-900"} relative cursor-pointer select-none py-2 pl-3 pr-9`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`${selected ? "text-gray-300" : "text-black"} block truncate`}
                                >
                                  ALL
                                </span>
                              </>
                            )}
                          </Listbox.Option>

                          {/* Existing categories */}
                          {categories.map((category) => (
                            <Listbox.Option
                              key={category.id}
                              value={category}
                              className={({ active }) =>
                                `${active ? "bg-[#C1AE94] text-white" : "text-gray-900"} relative cursor-pointer select-none py-2 pl-3 pr-9`
                              }
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`${selected ? "text-gray-300" : "text-black"} block truncate`}
                                  >
                                    {category.name.toUpperCase()}
                                  </span>
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            )}
          />
          {productData.length > 0 ? (
            <div className="flex flex-col gap-10 md:grid md:grid-cols-2 lg:grid lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="relative flex w-full"
                >
                  <div className="relative flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl shadow-lg shadow-gray-200">
                    <div className="relative flex h-auto w-full flex-col justify-between overflow-hidden rounded-md">
                      <div className="relative h-[25rem] w-full">
                        <Image
                          src={product.image1}
                          style={{ objectFit: "cover" }}
                          fill
                          priority={true}
                          alt={"Foto Coba"}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <button
                          aria-label="Heart Item"
                          className="absolute right-4 top-4 flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-white"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleWishlistClick(product.id);
                          }}
                        >
                          {likedProducts.includes(product.id) ? (
                            <HeartSolidIcon className="h-8 w-8 text-red-500" />
                          ) : (
                            <HeartOutlineIcon className="h-8 w-8 text-gray-200" />
                          )}
                        </button>
                      </div>
                      <div className="relative mx-4 my-2 flex h-[12rem] flex-col justify-between gap-4">
                        <div className="relative flex flex-col">
                          <div>
                            <span className="text-[20px] font-medium text-[#C1AE94]">
                              {product.name}
                            </span>
                          </div>
                          <div className="h-[3.5rem] w-full">
                            <span className="text-[16px] font-light text-black">
                              {product.subDescriptions}
                            </span>
                          </div>
                        </div>
                        <div className="relative flex w-full flex-row items-center">
                          <div>
                            <span className="font-josefins text-[26px] font-semibold text-[#252525]">
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
                                <FormatRupiah price={product.priceIDR || 0} />
                              )}
                            </span>
                          </div>
                          {product.Discount?.[0]?.discount && (
                            <div className="absolute -top-10 animate-bounce rounded bg-red-500 p-1 text-[18px] text-white">
                              {`${(product.Discount[0].discount * 100).toFixed(0)}%`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-10 md:grid md:grid-cols-2 lg:grid lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="relative flex w-full animate-pulse flex-col justify-between overflow-hidden rounded-xl "
                >
                  <div className="relative flex h-[25rem] w-full rounded-md bg-gray-300"></div>
                  <div className="relative mx-4 my-2 flex h-[12rem] flex-col justify-between gap-4">
                    <div className="relative flex flex-col gap-2">
                      <div className="h-6 w-2/3 rounded bg-gray-300"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                    </div>
                    <div className="relative flex w-full flex-row items-center justify-between">
                      <div className="h-6 w-1/3 rounded bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
