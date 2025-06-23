"use client";

import { Assets } from "@/assets";
import { ButtonPrimary, FormatRupiah, Notifications } from "@/components/atoms";
import { TransactionStatus } from "@/controller/user/transaction";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { GetListcart } from "@/controller/user/cart";
import { getBuyNowData } from "@/controller/user/buy-now";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";

export default function Payment() {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("paymentMethod");
  // const cartId = useSelector((state: RootState) => state.cart.cartId);
  const cartId = searchParams.get("cartId");
  const vaNumber = useSelector((state: RootState) => state.payment.vaNumber);
  const orderId = useSelector((state: RootState) => state.payment.orderId);
  const billerCode = useSelector(
    (state: RootState) => state.payment.billerCode,
  );

  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [cartHome, setCartHome] = useState<CartItem | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });

  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const checkIsLoggedIn = () => {
      setIsLoggedIn(!!session);
    };

    checkIsLoggedIn();
  }, [session]);

  useEffect(() => {
    async function fetchCartCount() {
      try {
        if (cartId == undefined) {
          const res = await GetListcart();
          const body = await res.json();
          setCartHome(body.data);
          return;
        } else {
          const res = await getBuyNowData(parseInt(cartId));
          const body = await res.json();
          setCartHome(body.data);
          // dispatch(setCartId(cartId));
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
    fetchCartCount();
  }, [isLoggedIn, cartId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          showNotification("Order has been cancelled due to timeout", "error");
          setTimeout(() => {
            router.push("/product");
          }, 3000);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const getBankName = (method: string | null) => {
    switch (method) {
      case "15":
        return "BCA";
      case "16":
        return "Mandiri";
      default:
        return "Unknown Bank";
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const handleNextButtonClick = async () => {
    try {
      const res = await TransactionStatus(orderId);
      const body = await res.json();
      if (res.ok) {
        if (body.data.status === "SUCCESS") {
          showNotification("Transaction successful", "success");
        } else if (body.data.status === "PENDING") {
          showNotification("Transaction pending", "error");
        } else if (body.data.status === "DECLINE") {
          showNotification("Transaction declined", "error");
        } else {
          showNotification("Unknown transaction status", "error");
        }
      } else {
        throw new Error("Failed to fetch transaction status");
      }
    } catch (error) {
      console.error("Error fetching transaction status:", error);
      showNotification("Failed to fetch transaction status", "error");
    }
  };

  return (
    <main className="relative h-full lg:h-screen">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="flex w-full flex-col gap-4 px-10 py-24 lg:flex-row">
        <div className="relative flex w-full flex-col rounded-md p-6 ring-1 ring-gray-200">
          <div className="flex-col pb-4">
            <div className="flex w-full flex-row items-center justify-between">
              <span className="font-josefins text-[20px] text-[#92734E]">
                Select Payment
              </span>
            </div>
            <div className="flex w-full items-center justify-between">
              <div>
                <h2 className="font-josefins text-[16px] text-[#231F20]">
                  Choose the payment method you want to use.
                </h2>
              </div>
              <div>
                <h2 className="font-josefins text-[16px] text-[#92734E]">
                  {formatTime(timeLeft)}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-[48px] rounded bg-[#F5F5F5] px-4 py-2 font-josefins text-[16px] ring-1 ring-gray-200">
              <div className="flex h-full items-center gap-4">
                <div>
                  <Image
                    src={Assets.IconBank}
                    alt="Icon Bank"
                    height={20}
                    width={20}
                  />
                </div>
                <span className="mt-1 font-josefins text-[16px]">
                  Bank Transfer - {getBankName(paymentMethod)}
                </span>
              </div>
            </div>
            {paymentMethod === "15" && (
              <div className="flex w-full flex-col gap-4 border-b-[0.5px] border-[#7D716A] px-4 py-2">
                <div className="flex w-full items-center justify-start gap-4">
                  <Image
                    src={Assets.IconBCA}
                    alt="Icon BCA"
                    height={50}
                    width={50}
                  />
                  <span className="mt-1 font-josefins text-[16px] font-light">
                    Virtual Account
                  </span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h2 className="font-domaine text-[24px] text-[#92734E]">
                    {vaNumber || "Loading . . ."}
                  </h2>
                  <button
                    className="font-josefins text-[16px] text-[#007BFF]"
                    aria-label="Copy Item"
                    onClick={() => {
                      if (vaNumber) {
                        navigator.clipboard.writeText(vaNumber);
                        showNotification(
                          "Virtual Account Number Copied",
                          "success",
                        );
                      }
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
            {paymentMethod === "16" && (
              <div>
                <div className="flex w-full flex-col gap-4 border-b-[0.5px] border-[#7D716A] px-4 py-2">
                  <div className="flex w-full items-center justify-start gap-4">
                    <Image
                      src={Assets.IconMandiri}
                      alt="Icon MANDIRI"
                      height={50}
                      width={50}
                    />
                    <span className="mt-1 font-josefins text-[16px] font-light">
                      Biller Code
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <h2 className="font-domaine text-[24px] text-[#92734E]">
                      {billerCode || "Loading . . ."}
                    </h2>
                    <button
                      className="font-josefins text-[16px] text-[#007BFF]"
                      aria-label="Copy Item"
                      onClick={() => {
                        if (billerCode) {
                          navigator.clipboard.writeText(billerCode);
                          showNotification("Biller Code Copied", "success");
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 border-b-[0.5px] border-[#7D716A] px-4 py-2">
                  <div className="flex w-full items-center justify-start gap-4">
                    <Image
                      src={Assets.IconMandiri}
                      alt="Icon MANDIRI"
                      height={50}
                      width={50}
                    />
                    <span className="mt-1 font-josefins text-[16px] font-light">
                      Virtual Account
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <h2 className="font-domaine text-[24px] text-[#92734E]">
                      {vaNumber || "Loading . . ."}
                    </h2>
                    <button
                      className="font-josefins text-[16px] text-[#007BFF]"
                      aria-label="Copy Item"
                      onClick={() => {
                        if (vaNumber) {
                          navigator.clipboard.writeText(vaNumber);
                          showNotification("Bill Key Copied", "success");
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="ml-4">
              <h2 className="font-regular text-[14px] text-[#231F20]">
                Pay within{" "}
                <span className="font-semibold text-[#92734E]">
                  10 minutes.
                </span>{" "}
                more than that the order will be cancelled.
              </h2>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-4 rounded-md p-6 ring-1 ring-gray-200">
            <div className="pb-4">
              <span className="font-josefins text-[20px] text-[#92734E]">
                Shopping Cart
              </span>
            </div>
            <div className="flex h-full w-full flex-col gap-2">
              {cartHome &&
                cartHome.cart?.map((item, index) => (
                  <div
                    key={index}
                    className="flex h-full w-full flex-row items-center justify-between border-b-[0.5px] border-[#7D716A] lg:h-[150px]"
                  >
                    <div className="flex h-[20rem] w-full flex-col items-start justify-between gap-2 lg:h-[8rem] lg:flex-row">
                      <div className="relative flex h-[20rem] w-full flex-col items-start gap-2 lg:h-full lg:flex-row">
                        <div className="relative h-[20rem] w-full rounded-md bg-gray-50 lg:h-[8rem] lg:w-[11rem]">
                          <Image
                            src={item.product?.image1 || Assets.DefaultProduct}
                            alt={item.product?.name || "Empty"}
                            fill
                            // style={{ objectFit: "cover" }}
                            className="rounded-[4px]"
                          />
                        </div>
                        <div className="flex h-[8rem] w-full flex-col justify-between lg:w-[90%]">
                          <div className="flex w-[100%] flex-col gap-1">
                            <div>
                              <h2 className="text-[14px] font-semibold text-[#231F20]">
                                {item.product?.name}
                              </h2>
                            </div>
                            <div>
                              <h2 className="font-regular text-[14px] text-[#231F20]">
                                {item.product?.subDescriptions}
                              </h2>
                            </div>
                          </div>
                          <div className="flex w-full items-center justify-between">
                            <div className="mb-2">
                              <h2 className="font-josefins text-[18px] font-semibold text-[#231F20] lg:text-[16px]">
                                <FormatRupiah
                                  price={item.product?.priceIDR || 0}
                                />
                              </h2>
                            </div>
                            <div>
                              <h2 className="font-josefins text-[18px] font-semibold text-[#231F20] lg:text-[16px]">
                                {item.buyQuantity} Items
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex w-full justify-between">
                <div>
                  <h2 className="font-josefins text-[16px] text-[#ADADAD]">
                    Subtotal Product
                  </h2>
                </div>
                <FormatRupiah price={cartHome?.total || 0} />
              </div>
              <div className="flex w-full justify-between">
                <div>
                  <h2 className="font-josefins text-[16px] text-[#ADADAD]">
                    Tax
                  </h2>
                </div>
                <span>Rp 0</span>
              </div>
            </div>
            <div className="border-t-[0.5px] border-[#7D716A] py-4">
              <div className="flex w-full justify-between">
                <div>
                  <h2 className="font-josefins text-[16px] text-[#92734E]">
                    Grand Total
                  </h2>
                </div>
                <span>
                  <FormatRupiah price={cartHome?.total || 0} />
                </span>
              </div>
            </div>
          </div>
          <ButtonPrimary
            text="Next"
            height="h-[50px]"
            width="w-full"
            onClick={handleNextButtonClick}
          />
        </div>
      </div>
    </main>
  );
}
