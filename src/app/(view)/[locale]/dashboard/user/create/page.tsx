"use client";

import React, { useEffect, useState } from "react";
import { UserValidation } from "@/lib/zod-schema/user";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CreateUser } from "@/controller/admin/user";
import {
  ButtonPrimary,
  InputField,
  InputPassword,
  Notifications,
} from "@/components";
import { $Enums, Gander, Role } from "@prisma/client";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function BuatUser() {
  type Users = z.infer<typeof UserValidation> & { gander: Gander };
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Users>({});
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const [selectedRoles, setSelectedRoles] = useState<Role | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const onSubmit = async (formData: Users) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await CreateUser(formData);
      if (response.status === 200) {
        showNotification(`${formData.name} created successfully!`, "success");

        setTimeout(() => {
          window.location.reload();
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

  useEffect(() => {
    if (session) {
      const userRole = session.user.role as $Enums.Role;
      const rolesToExclude: Role[] = [];

      const allRoles: Role[] = Object.values($Enums.Role);
      const filteredRoles = allRoles.filter(
        (role) => !rolesToExclude.includes(role),
      );

      setAvailableRoles(filteredRoles);
    }
  }, [session]);

  return (
    <main className="relative h-full w-full flex-col ">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit((value) => {
          const { gander, role, ...rest } = value;
          onSubmit({
            role: selectedRoles as Role,
            gander,
            ...rest,
          });
        })}
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
              placeholder="Email"
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
              placeholder="Name"
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
          <div className="flex flex-col gap-2">
            <div className="flex flex-row">
              <div className="flex w-full flex-col gap-2">
                <label className="font-josefins text-[16px] text-[#ADADAD]">
                  Gender
                </label>
                <Controller
                  name="gander"
                  control={control}
                  render={({ field }) => (
                    <div className="flex w-full flex-row gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...field}
                          value="Male"
                          checked={field.value === "Male"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...field}
                          value="Female"
                          checked={field.value === "Female"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full justify-between gap-2">
              <div className="flex w-full flex-col gap-2">
                <label
                  htmlFor="role"
                  className="font-josefins text-[16px] font-semibold text-[#7D716A]"
                >
                  Roles
                </label>
                <Controller
                  control={control}
                  name="role"
                  rules={{ required: "Please select an option" }}
                  render={({ field }) => (
                    <Listbox
                      value={selectedRoles}
                      onChange={(selectedRoles) => {
                        setSelectedRoles(selectedRoles);
                        field.onChange(selectedRoles || null);
                      }}
                    >
                      {({ open }) => (
                        <>
                          <div className="relative">
                            <Listbox.Button className="flex w-full cursor-pointer items-center justify-between rounded-md border-[0.5px] border-[#7D716A] bg-[white]/[1%] bg-white px-4 py-2.5 text-left text-[#252525] text-[16pxh] outline-none focus:ring-black">
                              <span>
                                {selectedRoles ? selectedRoles : "Pilih Roles"}
                              </span>
                              <ChevronDownIcon
                                className={`h-5 w-5 transform transition-all duration-300 ${open ? "rotate-180" : ""}`}
                                aria-hidden="true"
                              />
                            </Listbox.Button>
                            <Transition
                              show={open}
                              enter="transition duration-300 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-300 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Listbox.Options
                                className="absolute z-[99] mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-[#252525] focus:outline-none sm:text-sm"
                                style={{
                                  display: open ? "block" : "none",
                                }}
                              >
                                {availableRoles.map((role) => (
                                  <Listbox.Option
                                    key={role}
                                    value={role}
                                    className={({ active }) =>
                                      `${active ? "bg-gradient-to-t from-[#B69B78] to-[#CDB698] text-white" : "text-gray-900"} relative cursor-pointer select-none py-2 pl-3 pr-9`
                                    }
                                  >
                                    {role}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                  )}
                />
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
              <InputField
                type="text"
                label="No. Telepon"
                placeholder="No. Telepon"
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
                placeholder="Alamat"
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "address",
                  autoComplete: "address",
                }}
              />
              <InputField
                type="text"
                label="Kode Pos"
                placeholder="Kode Pos"
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "postalCode",
                  autoComplete: "postalCode",
                }}
                error={errors.postalCode?.message}
              />
            </div>
            <div className="flex w-full justify-between gap-2">
              <InputField
                type="text"
                label="Kelurahan"
                placeholder="Kelurahan"
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "kelurahan",
                  autoComplete: "kelurahan",
                }}
              />
              <InputField
                type="text"
                label="Kecamatan"
                placeholder="Kecamatan"
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "kecematan",
                  autoComplete: "kecematan",
                }}
              />
            </div>
            <div className="flex w-full justify-between gap-2">
              <InputField
                type="text"
                label="Kota"
                placeholder="Kota"
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "city",
                  autoComplete: "city",
                }}
              />
              <InputField
                type="text"
                label="Negara"
                placeholder="Negara"
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "country",
                  autoComplete: "country",
                }}
              />
            </div>
          </div>
        </div>
        <ButtonPrimary text="Create User" height="h-[50px]" width="w-[49.5%]" />
      </form>
    </main>
  );
}
