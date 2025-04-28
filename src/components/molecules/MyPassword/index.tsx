"use client";

import {
  ButtonPrimary,
  InputPassword,
  Notifications,
} from "@/components/atoms";
import { ChangPassword } from "@/controller/user/profile";
import { profileUpdatePassword } from "@/lib/zod-schema/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const MyPassword = () => {
  type Password = z.infer<typeof profileUpdatePassword>;
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Password>({
    resolver: zodResolver(profileUpdatePassword),
  });

  const onSubmit = async (data: Password) => {
    try {
      const response = await ChangPassword(data);
      if (response.ok) {
        showNotification("Password changed successfully", "success");
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      showNotification("Failed to change password", "error");
      console.error("Failed to change password:", error);
    }
  };

  return (
    <div className="relative h-full w-full">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <InputPassword
              showPassword={showPassword}
              togglePassword={togglePassword}
              label="Old Password"
              register={register}
              name="oldPassword"
              width="w-[50%]"
              height="h-[50px]"
              placeholder="Old Password"
              error={
                errors.oldPassword
                  ? typeof errors.oldPassword === "object"
                    ? (errors.oldPassword as any).message
                    : "Password is required"
                  : ""
              }
            />
            <InputPassword
              showPassword={showPassword}
              togglePassword={togglePassword}
              label="Password"
              register={register}
              name="password"
              width="w-[50%]"
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
              showPassword={showPassword}
              togglePassword={togglePassword}
              label="Confirm Password"
              register={register}
              name="confirmPassword"
              width="w-[50%]"
              height="h-[50px]"
              placeholder="Confirm Password"
              error={
                errors.confirmPassword
                  ? typeof errors.confirmPassword === "object"
                    ? (errors.confirmPassword as any).message
                    : "Confirm Password is required"
                  : ""
              }
            />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-josefins text-[16px] text-[#ADADAD]">
                Please add all necessary characters to create safe password.
              </h2>
            </div>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li className="font-josefins text-[16px] text-[#ADADAD]">
                Minimum characters 5
              </li>
              <li className="font-josefins text-[16px] text-[#ADADAD]">
                One uppercase character
              </li>
              <li className="font-josefins text-[16px] text-[#ADADAD]">
                One special caharacter
              </li>
              <li className="font-josefins text-[16px] text-[#ADADAD]">
                One Number
              </li>
            </ul>
          </div>
          <ButtonPrimary
            text="Change Password"
            width="w-[50%]"
            height="h-[50px]"
          />
        </div>
      </form>
    </div>
  );
};
