"use client";

import Image from "next/image";
import { Assets } from "@/assets";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn, useSession } from "next-auth/react";
import {
  ButtonPrimary,
  InputPassword,
  Notifications,
} from "@/components/atoms";
import { SendCartLocalyToDatabase } from "@/lib/cookies/cart";
import { SendCookieWishlist } from "@/lib/cookies/wishlist";
import { $Enums } from "@prisma/client";

interface FormValues {
  username: string;
  password: string;
}

export default function Login() {
  const roleCanAccessAdmin: $Enums.Role[] = [
    "ADMIN",
    "SALES",
    "LOGISTIC",
    "SUPER_ADMIN",
  ];

  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const [showSymphony, setShowSymphony] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const onSubmitCredential = async (data: FormValues) => {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (result?.ok) {
        showNotification("Login Successful! Welcome!", "success");
        const session = await getSession();
        await SendCartLocalyToDatabase(parseInt(session?.user.userId!));
        await SendCookieWishlist();
        setTimeout(() => {
          if (roleCanAccessAdmin.includes(session?.user?.role as $Enums.Role)) {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        }, 1000);
      } else {
        if (result?.error === "InvalidCredentialsError") {
          showNotification("Invalid email or password!", "error");
        } else {
          showNotification("Username atau Password Salah.", "error");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      showNotification(
        "An error occurred during login. Please try again later.",
        "error",
      );
    }
  };

  // const onSubmitGoogle = async () => {
  //   try {
  //     const result = await signIn("google", {
  //       redirect: false,
  //     });
  //   } catch (error) {}
  // };
  // useEffect(() => {
  //   setShowSymphony(true);
  // }, []);

  return (
    <main className="relative h-screen overflow-hidden">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="layer-bg -translate-z-[55px] scale-[1.06] bg-layer-10 bg-no-repeat" />
      <div className="relative flex h-full w-full">
        <div className="flex h-full w-0 items-center justify-center lg:w-[50%]">
          <div className="">
            <Image
              src={Assets.LogoEcho}
              alt="Logo Echo"
              loading="lazy"
              width={250}
              height={250}
            />
          </div>
          <div className="left-1/5 absolute bottom-10 hidden gap-4 lg:block">
            <Image
              src={Assets.Symphony}
              alt="Logo Echo"
              width={400}
              height={400}
            />
          </div>
        </div>
        <div className="z-[1] w-full p-6 md:h-full lg:w-[50%]">
          <div className="relative flex h-full w-full items-center justify-center rounded-xl border-[0.08px] border-[#E0E0E0]/30 bg-black/5 px-4 backdrop-blur-md">
            <div className="flex h-full w-full flex-col items-center justify-center gap-10">
              <div className="flex w-full flex-col gap-4 md:w-[60%] md:gap-0">
                <h2 className="text-center font-domaine text-2xl text-white md:text-3xl">
                  Welcome Back
                </h2>
                <p className="md:font-regular text-justify font-josefins text-lg font-light text-white md:text-center">
                  Sign in to continue your journey. Access exclusive features
                  and personalized experiences
                </p>
              </div>
              <div className="flex w-full items-center justify-center">
                <form
                  onSubmit={handleSubmit(onSubmitCredential)}
                  className="flex w-full flex-col gap-4 md:w-[60%]"
                >
                  <div className="relative flex w-full flex-col gap-2">
                    <input
                      type={"text"}
                      placeholder={"Email"}
                      autoComplete="on"
                      {...register("username", {
                        required: `Username is required`,
                      })}
                      className={`h-[50px] w-full appearance-none rounded-md border-[1px] border-gray-300 bg-[white]/[1%] px-4 py-2.5 font-josefins font-semibold text-gray-300 placeholder-gray-300 outline-none focus:border-[1px] focus:border-[#CDB698]`}
                    />
                    {errors.username && (
                      <p className="font-josefins text-sm text-red-500">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <InputPassword
                    showPassword={showPassword}
                    togglePassword={togglePassword}
                    register={register}
                    name="password"
                    width="w-350px md:w-full"
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
                  <ButtonPrimary
                    text="Login"
                    width="w-full"
                    height="h-[48px]"
                  />
                </form>
              </div>
              <div className="">
                <Image
                  src={Assets.LogoOr}
                  alt="Logo Or"
                  width={400}
                  height={400}
                  style={{ width: "auto" }}
                />
              </div>
              <div className="">
                <h2 className="font-josefins text-sm font-light text-white">
                  Dont have an account ? {""}
                  <span className="border-b-[0.5px] border-[#CCB596] font-josefins text-sm font-light">
                    <Link href="/register" className="text-[#C9B192]">
                      Create Account
                    </Link>
                  </span>
                </h2>
              </div>
              {/* <div className="w-full md:w-[60%]">
                <button
                  type="submit"
                  className="w-full rounded-md border-[0.75px] border-white/50 bg-[#BCBCBC]/25 px-4 py-3 text-white transition-all duration-300 ease-in-out hover:bg-white/25 focus:border-[#C9B192] focus:outline-none focus:ring-[0.5px] focus:ring-[#C9B192]"
                  onClick={onSubmitGoogle}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      src={Assets.LogoGoogle}
                      alt="Logo Google"
                      width={20}
                      height={20}
                      style={{ width: "auto" }}
                    />
                    <p className="text-sm font-light">Sign in with Google</p>
                  </div>
                </button>
              </div> */}
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
