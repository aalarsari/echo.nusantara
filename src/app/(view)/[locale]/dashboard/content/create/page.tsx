"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronDownIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { BannerValidation } from "@/lib/zod-schema/banner";
import Image from "next/image";
import { ButtonPrimary } from "@/components/atoms";
import { CreateBanner } from "@/controller/admin/banner";
import { Notifications } from "@/components/atoms";
import { $Enums, CategoryBanner } from "@prisma/client";
import { Listbox, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";

export default function CreateContent() {
  type Banners = z.infer<typeof BannerValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Banners>({
    resolver: zodResolver(BannerValidation),
  });
  const router = useRouter();
  const { data: session } = useSession();
  const [image1Hovered, setImage1Hovered] = useState(false);
  const [selectedImage1, setSelectedImage1] = useState<File | null>(null);
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

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryBanner | null>(null);
  const [availableCategory, setAvailableCategory] = useState<CategoryBanner[]>(
    [],
  );

  const onSubmit = async (formData: Banners) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await CreateBanner(formData);

      if (response.status === 200) {
        showNotification("Banner created successfully!", "success", 1000);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const responseData = await response.json();
        const errorMessage = responseData.message;
        showNotification(`Internal Server Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error creating banner:", error);
      showNotification(
        "Internal Server Error: Failed to create banner.",
        "error",
      );
    }
  };

  useEffect(() => {
    if (session) {
      const categoryToExclude: CategoryBanner[] = [];

      const allCategory: CategoryBanner[] = Object.values(
        $Enums.CategoryBanner,
      );
      const filteredCategory = allCategory.filter(
        (category) => !categoryToExclude.includes(category),
      );

      setAvailableCategory(filteredCategory);
    }
  }, [session]);

  return (
    <main className="relative h-full w-full">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="flex flex-row items-center gap-2 pb-4">
        <PhotoIcon className="h-8 w-8 text-[#252525]" />
        <div className="">
          <h2 className="text-lg text-[#252525]">Add New Banner</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-start justify-between gap-8">
            <div className="flex w-full flex-col gap-8">
              <div className="flex w-full flex-col gap-4 rounded-md bg-gray-50 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#252525]">
                    Content
                  </h2>
                </div>
                <div className="flex w-full flex-col gap-6">
                  <div className="flex w-[350px] flex-col gap-2 md:w-full">
                    <div className="flex h-[16.5rem] w-full flex-col gap-2">
                      <Controller
                        control={control}
                        name={"photo"}
                        render={({ field: { value, onChange, ...field } }) => (
                          <>
                            {selectedImage1 ? (
                              <div
                                className="relative h-full w-full overflow-hidden rounded-md ring-[#C1AE94] hover:ring-1"
                                onMouseEnter={() => setImage1Hovered(true)}
                                onMouseLeave={() => setImage1Hovered(false)}
                              >
                                <Image
                                  src={URL.createObjectURL(selectedImage1)}
                                  alt="Banner"
                                  fill
                                />
                                {image1Hovered && (
                                  <div
                                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                                    onClick={() => setSelectedImage1(null)}
                                  >
                                    <TrashIcon className="h-10 w-10 text-white" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <label
                                htmlFor="photo"
                                className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-all duration-500 ease-in-out hover:bg-black hover:bg-opacity-10"
                              >
                                <input
                                  {...field}
                                  value={value?.photo}
                                  id="photo"
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                  onChange={(event) => {
                                    const file =
                                      event.target.files &&
                                      event.target.files[0];
                                    if (file) {
                                      onChange(file);
                                      setSelectedImage1(file);
                                    }
                                  }}
                                />
                                <PlusCircleIcon className="h-8 w-8 text-[#CDB698]" />
                              </label>
                            )}
                          </>
                        )}
                      />
                      {errors.photo && (
                        <p className="text-sm text-red-500">
                          {errors.photo.message?.toString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between gap-4">
                    <div className="flex w-full flex-col gap-2">
                      <label htmlFor="title" className="text-[#252525]">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        placeholder="Title"
                        {...register("title")}
                        className="w-full appearance-none rounded-md bg-white px-4 py-2.5 text-[#ccc] outline-none ring-1 ring-gray-100 focus:ring-1 focus:ring-[#CDB698]"
                      />
                      {errors.title && (
                        <span className="text-red-500">
                          {errors.title.message}
                        </span>
                      )}
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      <label htmlFor="subtitle" className="text-[#252525]">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        id="subtitle"
                        placeholder="Subtitle"
                        {...register("subtitle")}
                        className="w-full appearance-none rounded-md bg-white px-4 py-2.5 text-[#ccc] outline-none ring-1 ring-gray-100 focus:ring-1 focus:ring-[#CDB698]"
                      />
                      {errors.subtitle && (
                        <span className="text-red-500">
                          {errors.subtitle.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="category"
                      className="font-josefins text-[16px] font-semibold text-[#7D716A]"
                    >
                      Category
                    </label>
                    <Controller
                      control={control}
                      name="category"
                      rules={{ required: "Please select an option" }}
                      render={({ field }) => (
                        <Listbox
                          value={selectedCategory}
                          onChange={(selectedCategory) => {
                            setSelectedCategory(selectedCategory);
                            field.onChange(selectedCategory || null);
                          }}
                        >
                          {({ open }) => (
                            <>
                              <div className="relative">
                                <Listbox.Button className="flex w-full cursor-pointer items-center justify-between rounded-md border-[0.5px] border-[#7D716A] bg-[white]/[1%] bg-white px-4 py-2.5 text-left text-[#252525] text-[16pxh] outline-none focus:ring-black">
                                  <span>
                                    {selectedCategory
                                      ? selectedCategory
                                      : "Pilih Category"}
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
                                    {availableCategory.map((category) => (
                                      <Listbox.Option
                                        key={category}
                                        value={category}
                                        className={({ active }) =>
                                          `${active ? "bg-gradient-to-t from-[#B69B78] to-[#CDB698] text-white" : "text-gray-900"} relative cursor-pointer select-none py-2 pl-3 pr-9`
                                        }
                                      >
                                        {category}
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
                    {errors.category && (
                      <p className="text-sm text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ButtonPrimary text="Add Content" width="w-[49%]" height="h-[48px]" />
        </div>
      </form>
    </main>
  );
}
