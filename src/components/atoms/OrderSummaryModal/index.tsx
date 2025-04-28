import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import moment from "moment-timezone";
import { Assets } from "@/assets";
import { ButtonPrimary } from "../ButtomPrimary";
import { FormatRupiah } from "../FormatRupiah";

interface ProfileData {
  address?: string | null;
}

interface CartHome {
  cart?: CartItem[] | null;
}

interface OrderSummaryModalProps {
  isModalOpen: boolean;
  profileData?: ProfileData;
  cartHome?: CartHome;
  selectedCourier?: string;
  selectedService?: string;
  handleCheckout: () => void;
  onClose: () => void;
  shipmentCost: number;
}

export const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isModalOpen,
  profileData,
  cartHome,
  selectedCourier,
  selectedService,
  handleCheckout,
  onClose,
  shipmentCost,
}) => {
  if (!isModalOpen) return null;

  const calculateSubtotal = (): number => {
    return (
      cartHome?.cart?.reduce((total, item) => {
        const price = item.product?.priceIDR || 0;
        const discount = item.product?.Discount?.[0]?.discount || 0;
        const discountedPrice = price - price * discount;
        return total + discountedPrice * (item.buyQuantity || 1);
      }, 0) || 0
    );
  };

  const productTotal = calculateSubtotal();
  const grandTotal = productTotal + shipmentCost;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex h-[40rem] w-[80%] flex-col gap-4 rounded-lg bg-[#FCFCFC] p-8 shadow-lg md:w-[40%]">
        <div>
          <h2 className="text-center font-domaine text-[24px] font-bold text-[#C1AE94]">
            Order Summary
          </h2>
          <hr className="my-1 border-t-[0.5px] border-[#7D716A]" />
        </div>
        <div className="h-[40rem] overflow-auto overflow-y-scroll">
          <div className="flex flex-col gap-4">
            <div className="flex w-full justify-between">
              <div className="flex w-[70%] flex-col gap-2">
                <span className="font-josefins text-[14px] font-semibold text-[#ADADAD]">
                  Delivery Address
                </span>
                <p className="font-domaine text-[16px] text-[#252525]">
                  {profileData?.address || "No address provided"}
                </p>
              </div>
              <div className="flex w-[30%] flex-col gap-2">
                <span className="text-end font-josefins text-[16px] font-semibold text-[#231F20]">
                  {moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
                </span>
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex flex-col gap-2">
                <span className="font-josefins text-[14px] font-semibold text-[#ADADAD]">
                  Delivery Shipping
                </span>
                <p className="font-domaine text-[16px] uppercase text-[#252525]">
                  {selectedCourier || "No courier selected"} -{" "}
                  {selectedService || "No service selected"}
                </p>
              </div>
            </div>

            <hr className="my-1 border-t-[0.5px] border-[#7D716A]" />
          </div>

          <div className="flex flex-col gap-4">
            {cartHome?.cart?.map((item, index) => (
              <div
                key={index}
                className="flex h-full w-full flex-row items-center justify-between border-b-[0.5px] border-[#7D716A] py-2"
              >
                <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row">
                  <div className="relative flex w-full flex-col items-start gap-2 lg:h-full lg:flex-row">
                    <div className="relative h-[20rem] w-full rounded-md lg:h-[6rem] lg:w-[8rem]">
                      <Image
                        src={item.product?.image1 || Assets.DefaultProduct}
                        alt={item.product?.name || "Empty"}
                        fill
                        style={{ objectFit: "contain" }}
                        className="rounded-[4px]"
                      />
                    </div>
                    <div className="flex h-[6rem] w-full flex-col justify-between lg:w-[90%]">
                      <div className="flex w-[100%] flex-col gap-1">
                        <span className="font-domaine text-[14px] font-semibold text-[#231F20]">
                          {item.product?.name}
                        </span>
                        <span className="font-regular font-domaine text-[14px] text-[#231F20]">
                          {item.product?.subDescriptions}
                        </span>
                      </div>
                      <div className="flex w-full flex-row items-center gap-2 ">
                        <span className="font-josefins text-[18px] font-semibold text-[#231F20] lg:text-[16px]">
                          <FormatRupiah
                            price={
                              item.product?.Discount?.[0]?.discount
                                ? (item.product?.priceIDR || 0) -
                                  (item.product?.priceIDR || 0) *
                                    item.product.Discount[0]?.discount
                                : item.product?.priceIDR || 0
                            }
                          />
                        </span>
                        <span className="font-josefins text-[18px] font-semibold text-[#231F20] lg:text-[16px]">
                          x
                        </span>
                        <span className="font-josefins text-[18px] font-semibold text-[#231F20] lg:text-[16px]">
                          {item.buyQuantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="my-2 flex flex-col gap-2">
            <div className="flex w-full justify-between">
              <div>
                <span className="font-josefins text-[16px] text-[#ADADAD]">
                  Subtotal Product
                </span>
              </div>
              <span>
                <FormatRupiah price={productTotal} />
              </span>
            </div>

            <div className="flex w-full justify-between">
              <div>
                <span className="font-josefins text-[16px] text-[#ADADAD]">
                  Shipping
                </span>
              </div>
              <span>
                <FormatRupiah price={shipmentCost} />
              </span>
            </div>
            <div className="flex w-full justify-between">
              <div>
                <span className="font-josefins text-[16px] text-[#ADADAD]">
                  Grand Total
                </span>
              </div>
              <span>
                <FormatRupiah price={grandTotal} />
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-row gap-4">
          <button
            className="flex h-12 w-full items-center justify-center rounded border bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <ButtonPrimary
            onClick={handleCheckout}
            text="Next"
            width="w-full"
            height="h-12"
          />
        </div>
      </div>
    </div>
  );
};
