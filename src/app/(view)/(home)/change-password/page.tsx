"use client";

import React, { Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonPrimary, InputPassword } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoEcho } from "@/components/atoms/LogoEcho";

export default function ChangePassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordContent />
    </Suspense>
  );
}

function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = () => {};

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <div className="z-[1] mx-8 flex h-auto w-[40rem] items-center rounded-[15px] border-[0.25px] border-gray-100 bg-[#FCFCFC]/40 px-4 py-8 backdrop-blur-sm lg:px-16">
        <div className="relative flex w-full flex-col">
          <div className="flex w-full items-center justify-center">
            <LogoEcho />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-[#252525] text-center text-[18px] font-domaine">
                Masukkan kata sandi baru untuk akun kamu.
              </h2>
              <InputPassword
                showPassword={showPassword}
                togglePassword={togglePassword}
                label="Password"
                register={register}
                name="password"
                width="w-full"
                height="h-[55px]"
                // required
                color="border border-[#343434] text-[#252525]"
                placeholder="Password"
                // error={errors.password?.message}
              />
              <h2 className="font-semibold text-[#252525] text-center text-[18px] font-domaine">
                Kata sandi Anda harus berisi setidaknya:
              </h2>
              <ul className="flex list-disc flex-col gap-4 pl-4">
                <li>8 Karakter</li>
                <li>Kombinasi huruf besar dan kecil</li>
                <li>1 Angka atau spesial karakter (contoh: #?!*)</li>
              </ul>
              <InputPassword
                showPassword={showConfirmPassword}
                togglePassword={toggleConfirmPassword}
                label="Konfirmasi Password Baru"
                register={register}
                name="confirmPassword"
                width="w-full"
                height="h-[55px]"
                // required
                color="border border-[#343434]"
                // textColor="text-black"
                placeholder="Konfirmasi"
                // error={errors.confirmPassword?.message}
              />
            </div>
            <div className="mt-4">
              <ButtonPrimary text="Simpan" height="h-[55px]" width="w-full" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
