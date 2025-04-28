"use client";

import { Assets } from "@/assets";
import { ButtonPrimary, InputField, Notifications } from "@/components/atoms";
import { CreateContact } from "@/controller/noAuth/contact";
import { ContactValidations } from "@/lib/zod-schema/contact";
import { $Enums } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Listbox, Transition } from "@headlessui/react";

export default function Contact() {
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  type Contact = z.infer<typeof ContactValidations>;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Contact>();

  const categories = Object.values($Enums.QuestionsUserCategory);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const onSubmit = async (formData: Contact) => {
    try {
      const response = await CreateContact(formData);
      if (response.ok) {
        showNotification("Contact created successfully!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("Failed to update contact");
        showNotification("Failed to update contact", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("An error occurred while updating the contact", "error");
    }
  };

  return (
    <div className="relative h-full w-full ">
      <div className="h-full w-full">
        <div className="relative -top-10 h-[50vh] w-full overflow-hidden">
          <Image
            src={Assets.Contact}
            alt="FAQ"
            fill
            className="object-cover md:object-contain"
            priority={true}
            sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
            <div>
              <span className="font-domaine text-[36px] text-white">
                Have A Question?
              </span>
            </div>
            <div className="w-[50%]">
              <p className="text-center font-josefins text-[28px] font-thin text-white">
                Don{"'"}t hesitate, we{"'"}d love to hear from you
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex h-full w-full flex-col-reverse items-start justify-between gap-2 lg:h-[125vh] lg:flex-row lg:px-12 lg:py-4">
          <Notifications
            message={notification.message}
            type={notification.type}
            visible={notification.visible}
            top="6"
            onClose={() => setNotification({ ...notification, visible: false })}
          />
          <div className="flex h-full w-full items-start justify-center gap-6 rounded-md lg:p-6">
            <div className="flex h-[80%] w-[80%] flex-col gap-4 rounded bg-white lg:p-8">
              <div>
                <span className="font-josefins text-[20px] text-[#92734E]">
                  Get in Touch
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <span className="font-josefins text-[16px] font-light text-[#ADADAD]">
                    Email
                  </span>
                </div>
                <span className="font-josefins text-[16px] font-light text-[#231F20]">
                  aal@arsari.co.id
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <span className="font-josefins text-[16px] font-light text-[#ADADAD]">
                    No.Phone
                  </span>
                </div>
                <Link
                  target="_blank"
                  href={
                    "https://api.whatsapp.com/send/?phone=6282137476157&text=(Website)%20Halo+saya+ingin+bertanya+tentang+produk%20Echo%20Nusantara&type=phone_number&app_absent=0"
                  }
                >
                  <span className="font-josefins text-[16px] font-light text-[#231F20]">
                    +62 8213 7476 157
                  </span>
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <span className="font-josefins text-[16px] font-light text-[#ADADAD]">
                    Location
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-josefins text-[16px] font-normal text-[#231F20]">
                    Jakarta Head Office
                  </span>
                  <span className="font-josefins text-[16px] font-thin text-[#231F20]">
                    Sahid Sudirman Centre 50th floor, Jl Jenderal Sudirman No
                    86, Jakarta, Indonesia 10220.
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-josefins text-[16px] font-normal text-[#231F20]">
                    Surabaya Branch Office
                  </span>
                  <span className="font-josefins text-[16px] font-thin text-[#231F20]">
                    Jl. Ciliwung No. 1 Darmo, Wonokromo, Kota Surabaya,Indonesia
                    60241.
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-josefins text-[16px] font-normal text-[#231F20]">
                    Hongkong Branch Office
                  </span>
                  <span className="font-josefins text-[16px] font-thin text-[#231F20]">
                    AAL HK Trading Limited, address: 22/F 3 LOCKHART RD WANCHAI,
                    HONG KONG
                  </span>
                </div>
                <div className="mt-5 flex flex-row gap-4">
                  <Link
                    target="_blank"
                    href="https://api.whatsapp.com/send/?phone=6282137476157&text=(Website)%20Halo+saya+ingin+bertanya+tentang+produk%20Echo%20Nusantara&type=phone_number&app_absent=0"
                    className="w-full transform transition-all duration-300 hover:scale-95"
                  >
                    <div className="flex h-[2.65rem] w-full flex-row items-center justify-center gap-2 rounded bg-[#B69B78]/[22%]">
                      <span className="font-josefins text-[16px] font-light text-[#7D716A]">
                        WhatsApp
                      </span>
                      <Image
                        src={Assets.WhatsApp}
                        alt="WhatsApp"
                        className="h-5 w-5"
                      />
                    </div>
                  </Link>
                  <Link
                    href={"https://web.wechat.com/uklccp?lang=en_US&t=v2/index"}
                    className="w-full transform transition-all duration-300 hover:scale-95"
                  >
                    <div className="flex h-[2.65rem] w-full flex-row items-center justify-center gap-2 rounded bg-[#B69B78]/[22%]">
                      <span className="font-josefins text-[16px] font-light text-[#7D716A]">
                        WeChat
                      </span>
                      <Image
                        src={Assets.WeChat}
                        alt="WeChat"
                        className="h-5 w-5"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full rounded-md p-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-4"
            >
              <InputField
                type="text"
                label="Name"
                height="h-[50px]"
                width="w-[100%]"
                placeholder={"Name"}
                register={register}
                inputProps={{
                  name: "name",
                  autoComplete: "name",
                }}
                error={errors.name?.message}
              />
              <InputField
                type="text"
                label="Email"
                height="h-[50px]"
                width="w-[100%]"
                placeholder={"Email"}
                register={register}
                inputProps={{
                  name: "email",
                  autoComplete: "email",
                }}
                error={errors.email?.message}
              />
              <InputField
                type="text"
                label="No Handphone"
                height="h-[50px]"
                width="w-[100%]"
                placeholder={"No Handphone"}
                register={register}
                inputProps={{
                  name: "nohandphone",
                  autoComplete: "nohandphone",
                }}
                error={errors.nohandphone?.message}
              />
              <div className="relative flex w-full flex-col gap-2">
                <label className="font-josefins text-[16px] font-semibold text-[#7D716A]">
                  Category
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <div className="relative w-full">
                      <Listbox value={field.value} onChange={field.onChange}>
                        <div className="relative">
                          <Listbox.Button className="relative h-[50px] w-full cursor-pointer rounded-md border-[0.5px] border-[#7D716A] px-4 py-2 text-left">
                            <span className="block truncate font-josefins text-[16px] font-semibold text-[#7D716A]">
                              {field.value || "Select a category"}
                            </span>
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                            {categories.map((category, index) => (
                              <Listbox.Option
                                key={index}
                                value={category}
                                className={({ active }) =>
                                  `cursor-pointer select-none px-4 py-2 ${
                                    active
                                      ? "font-josefins text-[16px] font-semibold text-[#7D716A]"
                                      : "font-josefins text-[16px] font-semibold text-[#7D716A]"
                                  }`
                                }
                              >
                                {category}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <InputField
                type="text"
                label="Title"
                height="h-[50px]"
                width="w-[100%]"
                placeholder={"Title"}
                register={register}
                inputProps={{
                  name: "title",
                  autoComplete: "title",
                }}
                error={errors.title?.message}
              />
              <InputField
                type="text"
                label="Description"
                height="h-[50px]"
                width="w-[100%]"
                placeholder={"Description"}
                register={register}
                inputProps={{
                  name: "description",
                  autoComplete: "description",
                }}
                error={errors.description?.message}
              />
              <InputField
                type="text"
                label="Message"
                height="h-[100px]"
                width="w-[100%]"
                placeholder={"Message"}
                register={register}
                inputProps={{
                  name: "message",
                  autoComplete: "message",
                }}
                error={errors.description?.message}
              />
              <ButtonPrimary text="Submit" width="w-[100%]" height="h-[50px]" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
