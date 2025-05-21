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
        <div className="relative h-screen w-full overflow-hidden">
          <Image
            src={Assets.Contact}
            alt="FAQ"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            priority={true}
          />

          <div className="absolute inset-0 flex justify-center items-center">
            <span className="font-domaine text-[36px] text-white font-bold">
              Need Help? Get in touch.
            </span>
          </div>
        </div>

        <div className="relative flex h-full w-full flex-col-reverse items-start justify-between gap-2 lg:h-[125vh] lg:flex-row lg:px-12 lg:py-20">
          <Notifications
            message={notification.message}
            type={notification.type}
            visible={notification.visible}
            top="6"
            onClose={() => setNotification({ ...notification, visible: false })}
          />

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
              <div className="flex flex-col lg:flex-row gap-4">
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
              </div>
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
              {/* <InputField
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
              /> */}
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
              <ButtonPrimary
                text="Submit"
                width="w-full lg:w-[267px]"
                height="h-[50px]"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
