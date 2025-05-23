"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import { useForm } from "react-hook-form";
import { Subscriber } from "@prisma/client";
import { Notifications } from "@/components/atoms";

import { z } from "zod";
import { SubscriberValidation } from "@/lib/zod-schema/subscriber";
import { CreateSubscribeAdmin } from "@/controller/admin/subscribe";
import { postSubscirbe } from "@/controller/noAuth/subscribe";

export const Subscribe = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof SubscriberValidation>>();

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

  const onSubmit = async (data: z.infer<typeof SubscriberValidation>) => {
    try {
      const response = await postSubscirbe(data);

      if (!response.ok) {
        throw new Error("Subscription failed. Please try again.");
      }
      showNotification("Subscribed successfully!", "success");
      reset();
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="relative py-20">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="relative flex h-[370px] w-full items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="relative z-[10] flex transform">
            <div className="flex h-full w-full flex-col items-center justify-center gap-6">
              <div className="w-[60%]">
                <h2 className="text-center font-domaine text-[24px] text-black lg:text-[36px]">
                  Stay Up to Date with All News and Exclusive Offers
                </h2>
              </div>
              <div className="relative h-[14vh] w-[250px] rounded-[4px] p-4 ring-1 ring-[#C1AE94] md:w-full lg:h-[55px] lg:w-[449px]">
                <input
                  type="text"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="w-full appearance-none bg-transparent p-2 outline-none lg:w-[70%] lg:p-0"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
                <div className="relative -bottom-6 z-[10] flex h-[39px] w-full -translate-y-1/2 transform items-center justify-center rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82] lg:absolute lg:right-2 lg:top-1/2 lg:w-[115px]">
                  <button
                    type="submit"
                    className="font-josefins text-[14px] uppercase text-white"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="absolute inset-0 mx-12 flex h-[370px] items-center justify-center overflow-hidden rounded-[4px]">
          <Image
            src={Assets.Subscribe}
            style={{ objectFit: "cover" }}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Photo Subscribe"
            priority
            title="Photo Subscribe"
          />
        </div>
      </div>
    </div>
  );
};
