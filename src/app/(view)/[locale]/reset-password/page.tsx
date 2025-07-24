"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { ButtonPrimary, InputField, Notifications } from "@/components";
import { LogoEcho } from "@/components/atoms/LogoEcho";
// import { useEmailPassword } from "@/app/hooks";

export default function ResetPassword() {
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {};

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="z-[1] mx-8 flex h-auto w-[40rem] justify-center items-center rounded-[15px] border-[0.25px] border-gray-100 bg-[#FCFCFC]/40 px-4 py-8 backdrop-blur-sm lg:px-16"
      >
        <div className="relative flex w-full flex-col gap-8">
          <div className="flex w-full items-center justify-center">
            <LogoEcho />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold font-domaine text-[20px] text-center">
              Atur ulang kata sandi
            </h2>
            <h2 className="font-semibold font-domaine text-[20px] text-center">
              Masukkan alamat email yang terhubung ke akun kamu untuk menerima
              email dari kami.
            </h2>
            <InputField
              type="text"
              label="Email"
              placeholder="Email"
              register={register}
              height="h-[55px]"
              color="border border-[#343434] text-[#343434]"
              inputProps={{
                name: "email",
                autoComplete: "email",
              }}
              //   error={errors.email?.message}
            />
          </div>
          <ButtonPrimary
            //   text={loading ? "Mengirim..." : "Kirim Link"}
            onClick={() => router.push("/change-password")}
            text="Kirim Link"
            height="h-[55px]"
            width="w-full"
          />
        </div>
      </form>
    </div>
  );
}
