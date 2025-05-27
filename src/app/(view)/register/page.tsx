"use client";

import Image from "next/image";
import { Assets } from "@/assets";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ButtonPrimary,
  InputPassword,
  Notifications,
} from "@/components/atoms";
import { RegisterValidation } from "@/lib/zod-schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Register } from "@/controller/auth/register";
import { z } from "zod";

export default function Login() {
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const [showSymphony, setShowSymphony] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  type User = z.infer<typeof RegisterValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(RegisterValidation),
  });
  const router = useRouter();
  const showNotification = (
    message: string,
    type: "success" | "error",
    duration: number = 3000
  ) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, duration);
  };

  const onSubmit = async (formData: User) => {
    try {
      const response = await Register(formData);
      if (response.status === 200) {
        showNotification(
          `${formData.name} created successfully!`,
          "success",
          1000
        );
        setTimeout(() => {
          navigateToLogin();
        }, 1000);
      } else {
        const errorMessage = await response.text();
        showNotification(`Internal Server Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      showNotification(
        "Internal Server Error: Failed to register user.",
        "error"
      );
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    setShowSymphony(true);
  }, []);

  return (
    <main className="relative h-screen overflow-hidden">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="layer-bg -translate-z-[55px] scale-[1.06] bg-layer-10 bg-no-repeat" />
      <div className="relative flex h-full w-full flex-col gap-8 justify-center items-center">
        <div className="flex w-full flex-col gap-4 md:w-[60%] md:gap-0">
          <h2 className="text-center font-domaine text-2xl text-white md:text-3xl">
            Welcome Back
          </h2>
          <p className="md:font-regular text-justify font-josefins text-lg font-light text-white md:text-center">
            Sign in to continue your journey. Access exclusive features and
            personalized experiences
          </p>
        </div>
        <div className="z-[1] h-auto w-[50%] px-10">
          <div className="relative flex h-full w-full items-center justify-center rounded-xl border-[0.08px] border-[#E0E0E0]/30 bg-white/40 p-10 backdrop-blur-md">
            <div className="flex h-full w-full flex-col items-center justify-center gap-10 ">
              <div className="flex w-full items-center justify-center">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-6"
                >
                  <div className="relative flex w-full flex-col gap-2">
                    <input
                      type={"text"}
                      placeholder={"Name"}
                      autoComplete="off"
                      {...register("name", {
                        required: `Full Name is required`,
                      })}
                      className={`h-[50px] w-full appearance-none rounded-md border-[1px] border-gray-300 bg-[white]/[1%] px-4 py-2.5 font-josefins font-semibold text-gray-300 placeholder-gray-300 outline-none focus:border-[1px] focus:border-[#CDB698]`}
                    />
                    {errors.name && (
                      <p className="font-josefins text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="relative flex w-full flex-col gap-2">
                      <input
                        type={"text"}
                        placeholder={"Email"}
                        autoComplete="off"
                        {...register("email", {
                          required: `Email is required`,
                        })}
                        className={`h-[50px] w-full appearance-none rounded-md border-[1px] border-gray-300 bg-[white]/[1%] px-4 py-2.5 font-josefins font-semibold text-gray-300 placeholder-gray-300 outline-none focus:border-[1px] focus:border-[#CDB698]`}
                      />
                      {errors.email && (
                        <p className="font-josefins text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="relative flex w-full flex-col gap-2">
                      <input
                        type={"text"}
                        placeholder={"Phone"}
                        autoComplete="off"
                        {...register("phone", {
                          required: `Phone is required`,
                        })}
                        className={`h-[50px] w-full appearance-none rounded-md border-[1px] border-gray-300 bg-[white]/[1%] px-4 py-2.5 font-josefins font-semibold text-gray-300 placeholder-gray-300 outline-none focus:border-[1px] focus:border-[#CDB698]`}
                      />
                      {errors.phone && (
                        <p className="font-josefins text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <InputPassword
                      showPassword={showPassword}
                      togglePassword={togglePassword}
                      register={register}
                      name="password"
                      width="w-full"
                      height="h-[50px]"
                      placeholder="Password"
                      error={
                        errors.password
                          ? typeof errors.password === "object"
                            ? (errors.password as any).message
                            : "Password is required"
                          : ""
                      }
                    />
                    <InputPassword
                      showPassword={showConfirmPassword}
                      togglePassword={toggleConfirmPassword}
                      register={register}
                      name="confirmPassword"
                      width="w-full"
                      height="h-[50px]"
                      placeholder="Confirm Password"
                      error={
                        errors.confirmPassword
                          ? typeof errors.confirmPassword === "object"
                            ? (errors.confirmPassword as any).message
                            : "Password is required"
                          : ""
                      }
                    />
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <ButtonPrimary
                      text="Login"
                      width="w-[238px]"
                      height="h-[50px]"
                    />
                    <div className="">
                      <h2 className="font-josefins text-[18px] font-light text-white">
                        Already had an account ? {""}
                        <span className="border-b-[0.5px] border-[#C1AE94] font-josefins text-[18px] font-light">
                          <Link href={"/login"} className="text-[#C1AE94]">
                            Login
                          </Link>
                        </span>
                      </h2>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="layer-content translate-z-[190px] pointer-events-none scale-[0.8]">
        <canvas className="rain h-full w-full" />
      </div>
    </main>
  );
}
