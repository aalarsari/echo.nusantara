"use client";

import React, { useState, useEffect } from "react";
import { GetListcart } from "@/controller/user/cart";
import { DropdownCouriers } from "@/components/atoms/DropdownCouriers";
import { DropdownServices } from "@/components/atoms/DropdownServices";
import {
  ButtonPrimary,
  FormatRupiah,
  InputField,
  Notifications,
} from "@/components";
import { checkoutValidation } from "@/lib/zod-schema/transaction";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkout as CheckoutTransaction } from "@/controller/user/transaction";
import { Assets } from "@/assets";
import Image from "next/image";
import { getBuyNowData } from "@/controller/user/buy-now";
import { OrderSummaryModal } from "@/components/atoms/OrderSummaryModal";
import { Profile, UpdateProfile } from "@/controller/user/profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdate } from "@/lib/zod-schema/profile";
import { useSession } from "next-auth/react";
import { RegisterAnonymus } from "@/controller/noAuth/anonymus-user";
import { GetProductLocaly, SendCartLocalyToDatabase } from "@/lib/cookies/cart";

interface CheckoutMethod extends z.infer<typeof checkoutValidation> {}

export default function Checkout() {
  var session = useSession();
  type User = z.infer<typeof profileUpdate>;
  const [profile, setProfile] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<User | undefined>(undefined);
  const [cartHome, setCartHome] = useState<CartItem | undefined>(undefined);
  const [selectedCourier, setSelectedCourier] = useState<string | undefined>(
    undefined,
  );
  const [courierServices, setCourierServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string | undefined>(
    undefined,
  );
  const [selectedServiceCode, setSelectedServiceCode] = useState<
    string | undefined
  >(undefined);

  const [shipmentCost, setShipmentCost] = useState<number>(0);
  const [isCourierDropdownOpen, setIsCourierDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({
    message: "",
    type: "success",
    visible: false,
  });

  const showNotification = (message: string, type: "success" | "error") => {
    if (notification.message !== message || notification.type !== type) {
      setNotification({ message, type, visible: true });
    }
  };

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification((prevNotification) => ({
          ...prevNotification,
          visible: false,
          message: "",
        }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.visible]);

  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data: User) => {
    try {
      if (session.data?.user && session.data.user.role == "USER") {
        const response = await UpdateProfile(data);
        if (response.status === 200) {
          showNotification(`${data.name} updated successfully!`, "success");
          setEditMode(false);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          const errorMessage = await response.text();
          showNotification(`Internal Server Error: ${errorMessage}`, "error");
        }
      } else {
        const reg = await RegisterAnonymus({
          email: data.email,
          postalCode: data.postalCode || "",
          city: data.city || "",
          address: data.address || "",
          name: data.name || "",
          phone: data.phone || "",
        });
        if (reg) {
          showNotification(`${data.name} updated successfully!`, "success");
          setEditMode(false);

          SendCartLocalyToDatabase(parseInt(reg.id!));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification(`Internal Server Error`, "error");
        }
      }
    } catch (error) {
      const errorMessage = "Internal Server Error: Failed to register product.";
      showNotification(errorMessage, "error");
    }
  };

  useEffect(() => {
    async function fetchCartCount() {
      try {
        if (
          session.status === "authenticated" &&
          session.data?.user.role == "USER"
        ) {
          if (cartId == undefined) {
            const res = await GetListcart();
            const body = await res.json();
            setCartHome(body.data);
            return;
          } else {
            const res = await getBuyNowData(parseInt(cartId));
            const body = await res.json();
            setCartHome(body.data);
          }
        } else {
          let data = await GetProductLocaly();
          setCartHome(data);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
    fetchCartCount();
  }, [isLoggedIn, cartId, session.data?.user, session.status]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(profileUpdate),
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await Profile();
        const { data } = response;
        setProfileData(data);
        if (data.phone) {
          data.phone = data.phone.replace(/\D/g, "");
          data.phone = data.phone.replace(/^62/, "");
        }
        Object.keys(data).forEach((key) => {
          if (key in data) {
            setValue(key as keyof User, data[key as keyof User]);
          }
        });
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    }
    fetchProfile();
  }, [setValue]);

  const handleCourierChange = (courierName: string) => {
    setSelectedCourier(courierName);
    setSelectedService(undefined);
    setSelectedServiceCode(undefined);
    setIsCourierDropdownOpen(false);

    const selectedCourierData =
      cartHome?.shipmentPrice?.filter(
        (courier) => courier.courier_code === courierName,
      ) || [];

    const serviceCodes = selectedCourierData.map(
      (courier) => courier.courier_service_name,
    );
    setCourierServices(serviceCodes);
    setShipmentCost(0);
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setIsServiceDropdownOpen(false);

    const selectedServiceData = cartHome?.shipmentPrice?.find(
      (courier) =>
        courier.courier_code === selectedCourier &&
        courier.courier_service_name === service,
    );

    if (selectedServiceData) {
      setShipmentCost(selectedServiceData.price);
      setSelectedServiceCode(selectedServiceData.courier_service_code);
    }
  };

  const uniqueCourierNames = cartHome?.shipmentPrice
    ? Array.from(
        new Set(cartHome.shipmentPrice.map((courier) => courier.courier_code)),
      )
    : [];

  const handleNextClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckout = async () => {
    try {
      if (!selectedCourier || !selectedServiceCode) {
        console.error("Missing required data for checkout.");
        window.alert("Missing required data for checkout.");
        return;
      }

      const checkoutData: CheckoutMethod = {
        cartIds: cartId != null ? [parseInt(cartId)] : cartHome?.cartids!,
        couriersCode: selectedCourier!,
        courierServiceCode: selectedServiceCode!,
      };

      const response = await CheckoutTransaction(checkoutData);
      const body = await response.json();
      const generatedUrl = body.data.generatedUrl;

      if (generatedUrl) {
        window.location.replace(generatedUrl);
      } else {
        console.error("Generated URL is missing.");
        showNotification("Generated URL is missing.", "error");
      }
    } catch (error) {
      showNotification("Failed to process checkout", "error");
    }
  };

  const handleToggleDropdown = () => {
    console.log("Profile Data: ", profileData);
    if (
      !profileData?.address?.trim() ||
      !profileData?.postalCode?.trim() ||
      !profileData?.city?.trim()
    ) {
      console.log("Invalid profile data:", profileData);
      showNotification(
        "Lengkapi Alamat, Kode Pos, dan Kota terlebih dahulu.",
        "error",
      );
      return;
    }
    setIsCourierDropdownOpen(!isCourierDropdownOpen);
  };

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
    <main className="relative flex h-full w-full flex-col gap-4 px-6 py-20 lg:flex-row lg:px-10 lg:py-24">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="flex h-full w-full flex-col gap-4 rounded-md p-6 ring-[0.5px] ring-[#7D716A]">
        <div className="flex-col pb-4">
          <div className="flex w-full flex-row items-center justify-between">
            <span className="font-josefins text-[20px] text-[#92734E]">
              Delivery Info
            </span>
            <button
              onClick={() => setEditMode(true)}
              aria-label="Edit"
              className="flex h-full items-center justify-center gap-2"
            >
              <span className="font-josefins text-[16px] text-[#c3c3c3]">
                Edit
              </span>
              <Image src={Assets.Edit} alt="Edit" className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="font-josefins text-[16px] text-[#231F20]">
              *Please check the information below before starting the payment.
            </h2>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <InputField
            type="text"
            label="Email"
            placeholder={profile?.email || "Email"}
            height="h-[50px]"
            register={register}
            inputProps={{
              name: "email",
              autoComplete: "email",
              disabled: !editMode,
            }}
            error={errors.email?.message}
          />
          <InputField
            type="text"
            label="Phone"
            placeholder={profile?.phone || "Phone"}
            height="h-[50px]"
            register={register}
            inputProps={{
              name: "phone",
              autoComplete: "phone",
              disabled: !editMode,
            }}
            error={errors.phone?.message}
          />
          <InputField
            type="text"
            label="Name"
            placeholder={profile?.name || "Name"}
            height="h-[50px]"
            register={register}
            inputProps={{
              name: "name",
              autoComplete: "name",
              disabled: !editMode,
            }}
            error={errors.name?.message}
          />
          <InputField
            type="text"
            label="Address"
            placeholder={profile?.address || "Address"}
            height="h-[50px]"
            register={register}
            inputProps={{
              name: "address",
              autoComplete: "address",
              disabled: !editMode,
            }}
            error={errors.address?.message}
          />
          <div className="flex flex-col gap-2 md:flex-row">
            <InputField
              type="text"
              label="Postal Code"
              placeholder={profile?.postalCode || "Postal Code"}
              height="h-[50px]"
              register={register}
              inputProps={{
                name: "postalCode",
                autoComplete: "postalCode",
                disabled: !editMode,
              }}
              error={errors.postalCode?.message}
            />
            <InputField
              type="text"
              label="City"
              placeholder={profile?.city || "City"}
              height="h-[50px]"
              register={register}
              inputProps={{
                name: "city",
                autoComplete: "city",
                disabled: !editMode,
              }}
              error={errors.city?.message}
            />
          </div>
          <div className="button-container">
            <div
              className={`transition-button w-full ${editMode ? "active" : ""}`}
            >
              <div className="flex flex-row gap-4">
                <ButtonPrimary text="Save" height="h-[50px]" width="w-full" />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="flex h-full w-full flex-col gap-4">
        <div className="flex h-full w-full flex-col gap-4 rounded-md p-6 ring-[0.5px] ring-[#7D716A]">
          <div className="">
            <span className="font-josefins text-[20px] text-[#92734E]">
              Shipping Method
            </span>
          </div>
          <DropdownCouriers
            couriers={uniqueCourierNames}
            profile={profile!}
            showNotification={showNotification}
            selectedCourier={selectedCourier}
            onSelectCourier={handleCourierChange}
            isDropdownOpen={isCourierDropdownOpen}
            toggleDropdown={handleToggleDropdown}
          />
          {selectedCourier && (
            <DropdownServices
              services={courierServices}
              selectedService={selectedService}
              onSelectService={handleServiceSelect}
              isDropdownOpen={isServiceDropdownOpen}
              toggleDropdown={() =>
                setIsServiceDropdownOpen(!isServiceDropdownOpen)
              }
              cartHome={cartHome}
              selectedCourier={selectedCourier}
            />
          )}
        </div>
        <div className="flex h-full w-full flex-col gap-2 rounded-md p-6 ring-[0.5px] ring-[#7D716A]">
          <div className="">
            <span className="font-josefins text-[20px] text-[#92734E]">
              Shopping Cart
            </span>
          </div>
          <div className="flex h-full w-full flex-col gap-2">
            {cartHome &&
              cartHome?.cart?.map((item, index) => (
                <div
                  key={index}
                  className="flex h-full w-full flex-row items-center justify-between border-b-[0.5px] border-[#7D716A] lg:h-[150px]"
                >
                  <div className="flex h-[20rem] w-full flex-col items-start justify-between gap-2 lg:h-[8rem] lg:flex-row">
                    <div className="relative flex h-[20rem] w-full flex-col items-start gap-2 lg:h-full lg:flex-row">
                      <div className="relative h-[20rem] w-full rounded-md bg-gray-50 lg:h-[8rem] lg:w-[8rem]">
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
                          <div className="flex w-full justify-between">
                            <span className="text-[14px] font-semibold text-[#231F20]">
                              {item.product?.name}
                            </span>
                            <span className="text-[14px] font-semibold text-[#231F20]">
                              {item.buyQuantity} Item
                            </span>
                          </div>
                          <div>
                            <span className="font-regular text-[14px] text-[#231F20]">
                              {item.product?.subDescriptions}
                            </span>
                          </div>
                        </div>
                        <div className="flex w-full items-center justify-between">
                          <div className="mb-2">
                            <div className="flex items-end justify-end">
                              {item.product?.Discount?.length > 0 &&
                              item.product?.Discount[0]?.discount ? (
                                <div className="flex flex-row items-end justify-center gap-2">
                                  <span className="text-gray-500 line-through">
                                    <FormatRupiah
                                      price={item.product?.priceIDR || 0}
                                    />
                                  </span>
                                  <FormatRupiah
                                    price={
                                      (item.product?.priceIDR || 0) -
                                      (item.product?.priceIDR || 0) *
                                        (item.product.Discount[0]?.discount ||
                                          0)
                                    }
                                  />
                                  <span className="text-red-500">
                                    {`${(
                                      item.product.Discount[0]?.discount * 100
                                    ).toFixed(0)}% Off`}
                                  </span>
                                </div>
                              ) : (
                                <FormatRupiah
                                  price={item.product?.priceIDR || 0}
                                />
                              )}
                            </div>
                          </div>
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
          <ButtonPrimary
            onClick={handleNextClick}
            text="Next"
            width="w-full"
            height="h-12"
            disabled={!selectedCourier || !selectedService}
          />
        </div>
      </div>
      <OrderSummaryModal
        isModalOpen={isModalOpen}
        profileData={profileData}
        cartHome={cartHome}
        selectedCourier={selectedCourier}
        selectedService={selectedService}
        handleCheckout={handleCheckout}
        onClose={handleCloseModal}
        shipmentCost={shipmentCost}
      />
    </main>
  );
}
