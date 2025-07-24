"use client";

import { Assets } from "@/assets";
import { ButtonPrimary, InputField } from "@/components/atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Suspense, useEffect, useState } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBuyNowData } from "@/controller/user/buy-now";
import { useSession } from "next-auth/react";
import { GetListcart } from "@/controller/user/cart";
import { checkoutValidation } from "@/lib/zod-schema/transaction";
import { Checkout as CheckoutTransaction } from "@/controller/user/transaction";
import { useDispatch } from "react-redux";
import {
  setBillerCode,
  setOrderId,
  setVaNumber,
} from "@/lib/redux/paymentNumber";
import { setCartId } from "@/lib/redux/cartId";
import { generateKey } from "crypto";

interface PaymentMethod {
  id: number;
  name: string;
  subname: string;
  isActive: boolean;
}

interface CheckoutMethod extends z.infer<typeof checkoutValidation> {}

export default function SelectPayment() {
  type Checkout = z.infer<typeof checkoutValidation>;
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [cartHome, setCartHome] = useState<CartItem | null>(null);
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIsLoggedIn = () => {
      setIsLoggedIn(!!session);
    };

    checkIsLoggedIn();
  }, [session]);

  const {
    formState: { errors },
  } = useForm<Checkout>({
    resolver: zodResolver(checkoutValidation),
  });

  useEffect(() => {
    async function fetchCartCount() {
      try {
        if (cartId == undefined) {
          const res = await GetListcart();
          const body = await res.json();
          setCartHome(body.data);
          return;
        } else {
          const res = await getBuyNowData(parseInt(cartId!));
          const body = await res.json();
          setCartHome(body.data);
          dispatch(setCartId([parseInt(cartId)]));
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
    fetchCartCount();
  }, [isLoggedIn, cartId, dispatch]);

  const handleCheckout = async (data: Checkout): Promise<void> => {
    try {
      const res = await CheckoutTransaction(data);
      const body = await res.json();

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const responsePayment = body.data;


      if (!responsePayment) {
        throw new Error("Missing responsePayment in response");
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  };

  const handleNext = async () => {
    try {
      if (!cartId) {
        console.error("Invalid cart ID");
        return;
      }

      const checkoutData: CheckoutMethod = {
        cartIds: [parseInt(cartId)],
        couriersCode: "gojek",
        courierServiceCode: "instant",
      };

      const response = await CheckoutTransaction(checkoutData);
      const body = await response.json();


      const generatedUrl = body.data.data.response.generatedUrl;

      if (generatedUrl) {
        window.open(generatedUrl, "_blank");
      } else {
        console.error("Generated URL is missing.");
      }
    } catch (error) {
      console.error("Failed to process checkout:", error);
    }
  };

  return (
    <main className="h-full lg:h-screen">
      <div className="flex w-full flex-col gap-4 px-10 py-24 lg:flex-row">
        <div className="flex w-full flex-col gap-4">
          <div className="flex h-full w-full flex-col gap-4 rounded-md p-6 ring-1 ring-gray-200">
            <div className="pb-0 lg:pb-4">
              <span className="font-josefins text-[20px] text-[#92734E]">
                Shopping Cart
              </span>
            </div>
            <div className="flex h-full w-full flex-col gap-2">
              {cartHome &&
                cartHome.cart?.map((item, index) => (
                  <div
                    key={index}
                    className="flex h-full w-full flex-row items-center justify-between border-b-[0.5px] border-[#7D716A] lg:h-[150px] lg:px-2"
                  >
                    <div className="flex h-[20rem] w-full flex-col items-start justify-between gap-2 lg:h-[8rem] lg:flex-row">
                      <div className="relative flex h-[20rem] w-full flex-col items-start gap-2 lg:h-full lg:flex-row">
                        <div className="relative h-[20rem] w-full rounded-md bg-gray-50 lg:h-[8rem] lg:w-[40%]">
                          <Image
                            src={item.product?.image1 || Assets.DefaultProduct}
                            alt={item.product?.name || "Empty"}
                            fill
                            style={{ objectFit: "cover" }}
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
                                {"Rp"} {item.product?.priceIDR}
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
                <span>
                  {"Rp"} {cartHome?.total || 0}
                </span>
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
                  {"Rp"} {cartHome?.total || 0}
                </span>
              </div>
            </div>
          </div>
          <ButtonPrimary
            text="Next"
            height="h-[50px]"
            width="w-full"
            onClick={handleNext}
          />
        </div>
      </div>
    </main>
  );
}
