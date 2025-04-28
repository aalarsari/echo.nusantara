"use client";

import { z } from "zod";
import {
  ButtonPrimary,
  InputField,
  InputPassword,
  Notifications,
} from "@/components/atoms";
import { User as GetUser, UpdateUser } from "@/controller/admin/user";
import { UserUpdateValidation } from "@/lib/zod-schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gander, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface UserDetailProps {
  id: number;
}

export const UserDetail: React.FC<UserDetailProps> = ({ id }) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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

  //   Password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  //   Confirm Password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  type Users = z.infer<typeof UserUpdateValidation> & { gander: Gander };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<Users>({
    resolver: zodResolver(UserUpdateValidation),
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await GetUser(id);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const user = await response.json();
        setUserDetails(user.data as User);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [id]);

  useEffect(() => {
    if (userDetails?.gander) {
      setValue("gander", userDetails.gander);
    }
  }, [userDetails, setValue]);
  const onSubmit = async (formData: Users) => {
    const data = {
      name: formData.name ?? null,
      email: formData.email ?? null,
      gander: formData.gander ?? null,
      phone: formData.phone ?? null,
      address: formData.address ?? null,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await UpdateUser(data, id);
      if (response.status === 200) {
        showNotification("User updated successfully!", "success");
        setTimeout(() => {
          router.push("/dashboard/user");
        }, 1000);
      } else {
        const responseData = await response.json();
        const errorMessage = responseData.message;
        showNotification(`Internal Server Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      const errorMessage = "Internal Server Error: Failed to register product.";
      showNotification(errorMessage, "error");
    }
  };

  return (
    <main className="relative h-full w-full flex-col">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex w-full flex-col gap-4 rounded-md bg-gray-50 p-5">
          <div>
            <h2 className="text-lg font-semibold text-[#252525]">
              Customer Information
            </h2>
          </div>
          <div className="flex w-full justify-between gap-2">
            <InputField
              type="text"
              label="Email"
              placeholder={userDetails?.email || "Email"}
              width="w-full"
              register={register}
              color="bg-white ring-1 ring-gray-100 text-[#ccc]"
              inputProps={{
                name: "email",
                autoComplete: "email",
              }}
              error={errors.email?.message}
            />
            <InputField
              type="text"
              label="Name"
              placeholder={userDetails?.name || "Name"}
              width="w-full"
              register={register}
              color="bg-white ring-1 ring-gray-100 text-[#ccc]"
              inputProps={{
                name: "name",
                autoComplete: "name",
              }}
              error={errors.name?.message}
            />
          </div>
          <div className="flex w-full justify-between gap-2">
            <InputPassword
              showPassword={showPassword}
              togglePassword={togglePassword}
              label="Password"
              register={register}
              name="password"
              width="w-full"
              height="h-[50px]"
              placeholder="Password"
            />
            <InputPassword
              showPassword={showConfirmPassword}
              togglePassword={toggleConfirmPassword}
              label="Confirm Password"
              register={register}
              name="confirmPassword"
              width="w-full"
              height="h-[50px]"
              placeholder="Confirm Password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row">
              <div className="flex w-full flex-col gap-2">
                <label className="font-josefins text-[16px] text-[#ADADAD]">
                  Gender
                </label>
                <Controller
                  name="gander"
                  control={control}
                  defaultValue={userDetails?.gander! || ""}
                  render={({ field }) => (
                    <div className="flex w-full flex-row gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...field}
                          value="Male"
                          checked={field.value === "Male"}
                          onChange={() => {
                            field.onChange("Male");
                          }}
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...field}
                          value="Female"
                          checked={field.value === "Female"}
                          onChange={() => {
                            field.onChange("Female");
                          }}
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  )}
                />
              </div>
              <InputField
                type="text"
                label="No. Telepon"
                placeholder={userDetails?.phone || "No. Telepon"}
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "phone",
                  autoComplete: "phone",
                }}
                error={errors.phone?.message}
              />
            </div>
            <div className="flex w-full justify-between gap-2">
              <InputField
                type="text"
                label="Alamat"
                placeholder={userDetails?.address || "Alamat"}
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "address",
                  autoComplete: "address",
                }}
                error={errors.address?.message}
              />
            </div>
          </div>
        </div>
        <ButtonPrimary text="Update User" height="h-[50px]" width="w-[49.5%]" />
      </form>
    </main>
  );
};
