"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import {
  ShoppingCartIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { SaveCartLocaly } from "@/lib/cookies/cart";
import { DetailShop } from "@/controller/noAuth/shop";
import { CreateNewcart } from "@/controller/user/cart";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { incrementCart } from "@/lib/redux/pinCount";
import { BuyNow } from "@/controller/user/buy-now";
import { useRouter } from "next/navigation";
import { setCartId } from "@/lib/redux/cartId";
import { FormatRupiah, Notifications } from "@/components";
import { GetStock } from "@/controller/noAuth/stock";

export default function DetailShopComponent({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [productDetail, setProductDetail] = useState<Products | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, SetQuantity] = useState<string>("0");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  var dispatch: AppDispatch = useDispatch();
  const [stock, setStock] = useState<number | undefined>(undefined);

  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const showNotification = (
    message: string,
    type: "success" | "error",
    duration: number = 3000,
  ) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, duration);
  };

  useEffect(() => {
    const fetchDetailShop = async (slug: string) => {
      try {
        const res = await DetailShop(slug);
        if (!res.ok) {
          throw new Error("Failed to fetch product detail");
        }
        const body = await res.json();
        setProductDetail(body.data);

        await fetchStock(body.data.id);
      } catch (error) {
        setError("Error fetching product detail");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailShop(params.slug);
  }, [params.slug]);

  // Fetch stock
  const fetchStock = async (productId: number) => {
    try {
      const stockRes = await GetStock(productId);
      if (stockRes.ok) {
        const stockData = await stockRes.json();
        console.log("Stock:", stockData.data);
        setStock(stockData.data);
      } else {
        throw new Error("Failed to fetch stock");
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
      setError("Error fetching stock");
    }
  };

  // Modal logic
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const addToCart = async (productId: number, quantity: number) => {
    if (stock === undefined) {
      showNotification(
        "Unable to fetch stock information. Please try again later.",
        "error",
      );
      return;
    }

    if (quantity <= 0) {
      showNotification("Quantity must be greater than 0.", "error");
      return;
    }
    if (quantity > stock) {
      showNotification(
        `Quantity cannot exceed available stock: ${stock}`,
        "error",
      );
      return;
    }

    try {
      if (!productDetail) {
        showNotification("Product details not found.", "error");
        return;
      }
      console.log(
        "Adding to cart with quantity:",
        quantity,
        "and stock:",
        stock,
      );

      const quantityToAdd = parseInt(quantity.toString(), 10);

      // Call the CreateNewcart API
      const response = await CreateNewcart({
        productId: productId,
        quantity: quantityToAdd,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        showNotification(
          `Error: ${errorResponse.message || "Failed to add product to cart"}`,
          "error",
        );
        return;
      }

      dispatch(incrementCart(1));
      showNotification(
        `${productDetail.name} added to cart successfully!`,
        "success",
        1000,
      );
      router.push("/shop");

      await fetchStock(productId);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      showNotification(
        `An unexpected error occurred: ${error instanceof Error ? error.message : "Please try again later"}`,
        "error",
      );
    }
  };

  const handleDecrease = () => {
    SetQuantity((prev) => {
      const newValue = parseInt(prev) - 1;
      if (newValue >= 1) {
        return newValue.toString();
      }
      return "1";
    });
  };

  const handleIncrease = () => {
    if (stock === undefined) {
      showNotification(
        "Unable to fetch stock information. Please try again later.",
        "error",
      );
      return;
    }

    SetQuantity((prev) => {
      const newQuantity = parseInt(prev) + 1;
      if (newQuantity > stock) {
        showNotification(
          `Quantity cannot exceed available stock: ${stock}`,
          "error",
        );
        return prev;
      }
      return newQuantity.toString();
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (stock === undefined) {
      showNotification(
        "Unable to fetch stock information. Please try again later.",
        "error",
      );
      return;
    }

    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      const numericValue = parseInt(newValue) || 0;
      if (numericValue > stock) {
        showNotification(
          `Quantity cannot exceed available stock: ${stock}`,
          "error",
        );
        return;
      }
      SetQuantity(newValue);
    }
  };

  const handleClickBuyNow = async () => {
    if (!productDetail) return;

    if (stock === undefined) {
      showNotification(
        "Unable to fetch stock information. Please try again later.",
        "error",
      );
      return;
    }

    const quantityToBuy = parseInt(quantity);
    if (quantityToBuy > stock) {
      showNotification(
        `Quantity cannot exceed available stock: ${stock}`,
        "error",
      );
      return;
    }

    try {
      if (session.data?.user && session.data.user.role === "USER") {
        const res = await BuyNow({
          productId: productDetail.id!,
          quantity: parseInt(quantity),
        });
        if (res.ok) {
          const body = await res.json();
          dispatch(setCartId([body.data.id]));
          router.push(`/checkout?cartId=${body.data.id}`);
        } else {
          const body = await res.json();
          alert(`${body.data.details[0].message}`);
        }
      } else {
        SaveCartLocaly(productDetail.id!, parseInt(quantity));
        router.push(`/checkout`);
      }
    } catch (error) {
      showNotification(
        "An error occurred during login. Please try again later.",
        "error",
      );
    }
  };

  const openModal = (imageUrl: string) => {
    setIsModalOpen(true);
    setModalImageUrl(imageUrl);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!productDetail) {
    return (
      <div className="h-full w-full px-4 lg:px-12 lg:py-20">
        <div className="flex h-full w-full flex-col lg:flex-row">
          <div className="flex h-full w-full flex-col gap-4 lg:h-[40rem] lg:w-[60%] lg:flex-row">
            <div className="relative h-[25rem] w-full animate-pulse overflow-hidden rounded-md bg-gray-200 lg:h-[40rem] lg:w-[40rem]" />
            <div className="flex flex-row gap-4 lg:flex-col">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-[6rem] w-[6rem] animate-pulse rounded-md bg-gray-200 lg:h-[10rem] lg:w-[10rem]"
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:h-[35rem] lg:w-[40%] lg:gap-4">
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="flex flex-row gap-2">
              <div className="h-10 w-1/4 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-1/4 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative h-full w-full px-4 lg:px-12 lg:py-20">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      {!isLoading && productDetail && (
        <>
          {isModalOpen && (
            <div className="fixed left-0 top-0 z-[999] flex h-screen w-full items-center justify-center bg-gray-900 bg-opacity-75 lg:w-full">
              <div className="">
                <div className="block md:hidden">
                  <Image
                    src={modalImageUrl}
                    alt="Product"
                    width={500}
                    height={500}
                    objectFit="contain"
                    className="z-[99]"
                  />
                </div>
                <div className="hidden md:block">
                  <Image
                    src={modalImageUrl}
                    alt="Product"
                    width={500}
                    height={500}
                    className="z-[99]"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-4  z-[999] text-white focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          )}
          <div className="h-full w-full">
            <div className="flex h-[3rem] flex-row items-center justify-start gap-2">
              <span className="rounded-full border-[1px] border-gray-200 px-4 py-1 text-center text-sm text-gray-400">
                Products
              </span>
              <span className="text-2xl text-gray-300">/</span>
              <span className="rounded-full border-[1px] border-gray-200 px-4 py-1 text-center text-sm text-[#252525]">
                Detail
              </span>
            </div>
            <div className="relative mt-2 flex h-full w-full flex-col gap-6 lg:flex-row">
              {productDetail && (
                <div className="flex h-full w-full flex-col gap-4 lg:h-[40rem] lg:w-[60%] lg:flex-row">
                  <div className="relative h-[25rem] w-full overflow-hidden rounded-md border border-[#C1AE94]/30 bg-gray-50 lg:h-[40rem] lg:w-[40rem]">
                    {productDetail.image1 && (
                      <Image
                        src={productDetail.image1 || Assets.DefaultProduct}
                        fill
                        style={{ objectFit: "cover" }}
                        priority={true}
                        alt={`${productDetail.name}`}
                        sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`transition-all duration-500 ${hoveredIndex === 0 ? "scale-110 transform" : ""}`}
                        onMouseEnter={() => setHoveredIndex(0)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() =>
                          openModal(
                            productDetail.image1 || Assets.DefaultProduct,
                          )
                        }
                      />
                    )}
                  </div>
                  <div className="flex flex-row gap-4 lg:flex-col">
                    {[
                      productDetail.image2,
                      productDetail.image3,
                      productDetail.image4,
                      productDetail.image5,
                    ].map((image, index) =>
                      image ? (
                        <div
                          key={index}
                          className="relative flex h-[6rem] w-full transform items-center justify-center overflow-hidden rounded-md border-[0.75px] border-gray-200 bg-gray-50 transition-all duration-100 hover:border-[1px] hover:border-[#C1AE94] lg:h-[10rem] lg:w-[10rem]"
                        >
                          <Image
                            src={image || Assets.DefaultProduct}
                            fill
                            style={{ objectFit: "cover" }}
                            priority={true}
                            alt={`${productDetail.name}`}
                            sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`transition-all duration-500 ${hoveredIndex === index + 1 ? "scale-110 transform" : ""}`}
                            onMouseEnter={() => setHoveredIndex(index + 1)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() =>
                              openModal(image || Assets.DefaultProduct)
                            }
                          />
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-6 lg:h-[35rem] lg:w-[40%] lg:gap-4">
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full flex-col gap-1">
                    <div className="">
                      <h2 className="text-2xl font-semibold text-[#252525]">
                        {productDetail?.name}
                      </h2>
                    </div>
                    <div className="flex flex-row gap-1"></div>
                  </div>
                  <div className="h-[5rem]">
                    <h2 className="font-domine text-lg text-[#252525]">
                      {productDetail?.subDescriptions}
                    </h2>
                  </div>
                  <div className="flex h-[3rem] w-full items-center justify-between">
                    <div className="relative flex w-full flex-row items-center">
                      <div>
                        <span className="font-josefins text-[26px] font-semibold text-[#252525]">
                          {productDetail.Discount?.length > 0 ? (
                            <div className="flex flex-row gap-2">
                              <span className="ml-2 text-red-500 line-through">
                                <FormatRupiah
                                  price={productDetail?.priceIDR || 0}
                                />
                              </span>
                              <FormatRupiah
                                price={
                                  productDetail?.priceIDR &&
                                  productDetail?.Discount[0]?.discount
                                    ? productDetail.priceIDR -
                                      productDetail.priceIDR *
                                        productDetail.Discount[0].discount
                                    : productDetail?.priceIDR || 0
                                }
                              />
                            </div>
                          ) : (
                            <FormatRupiah price={productDetail.priceIDR || 0} />
                          )}
                        </span>
                      </div>
                      {productDetail.Discount?.[0]?.discount && (
                        <div className="absolute -top-10 animate-bounce rounded bg-red-500 p-1 text-[18px] text-white">
                          {`${(productDetail.Discount[0].discount * 100).toFixed(0)}%`}
                        </div>
                      )}
                    </div>

                    <div className="my-2.5 flex flex-row gap-2">
                      <div className="flex h-[1.75rem] w-[6rem] rounded-sm border-[0.5px] border-[#7D716A]">
                        <button
                          onClick={handleDecrease}
                          className="mx-2 h-full w-[30%] cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={handleChange}
                          min="0"
                          className="h-full w-full appearance-none px-[2px] text-center outline-none"
                        />
                        <button
                          onClick={handleIncrease}
                          className="mx-2 h-full w-[30%] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button className="flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-sm border-[0.5px] border-[#7D716A]">
                        <TrashIcon className="h-5 w-5 text-[#7D716A]" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 lg:flex-row">
                  <div className="flex h-[48px] w-full transform items-center justify-center rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82] lg:w-[60%]">
                    <button
                      onClick={handleClickBuyNow}
                      className="h-full w-full text-[20px] uppercase text-white"
                    >
                      Buy Now
                    </button>
                  </div>
                  <div
                    key="addToCart"
                    onClick={() =>
                      addToCart(productDetail?.id!, parseInt(quantity))
                    }
                    className="flex h-[48px] w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-[4px] border-[1px] border-[#C1AE94] lg:w-[40%]"
                  >
                    <ShoppingCartIcon className="h-6 w-6 text-[#C1AE94]" />
                    <button className="text-[20px] uppercase text-[#C1AE94]">
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-[20px] font-semibold">
                      Other Information
                    </h2>
                  </div>
                  <div className="flex w-full flex-col justify-between gap-6">
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row items-center justify-start gap-1 lg:gap-2">
                        <Image
                          src={Assets.InfoKardus}
                          width={32}
                          height={32}
                          alt="Info Product Original"
                        />
                        <span className="text-[12px] text-[#231F20] lg:text-[18px]">
                          100% Product Original
                        </span>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1 lg:gap-2">
                        <Image
                          src={Assets.InfoDays}
                          width={32}
                          height={32}
                          alt="Info Days Estimated"
                        />
                        <span className="text-[12px] text-[#231F20] lg:text-[18px]">
                          Easy 30 Days Return
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row items-center justify-start gap-1 lg:gap-2">
                        <Image
                          src={Assets.InfoTangan}
                          width={32}
                          height={32}
                          alt="Info Pay Easily"
                        />
                        <span className="text-[12px] text-[#231F20] lg:text-[18px]">
                          Pay Easily
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-full w-full py-10">
            <div
              className="font-regular text-[#252525]"
              dangerouslySetInnerHTML={{
                __html: productDetail?.descriptions || "",
              }}
            />
          </div>
        </>
      )}
    </main>
  );
}
