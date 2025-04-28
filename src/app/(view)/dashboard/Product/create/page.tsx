"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProductValidation } from "@/lib/zod-schema/product";
import { AddProduct } from "@/controller/admin/product";
import { ButtonPrimary, InputField } from "@/components/atoms";
import {
  TrashIcon,
  BuildingStorefrontIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { GetCategory } from "@/controller/admin/category";
import Image from "next/image";
import { Listbox, Transition } from "@headlessui/react";
import { Notifications } from "@/components/atoms";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function CreateProduct() {
  type Products = z.infer<typeof ProductValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Products>({
    resolver: zodResolver(ProductValidation),
  });
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const [image1Hovered, setImage1Hovered] = useState(false);
  const [image2Hovered, setImage2Hovered] = useState(false);
  const [image3Hovered, setImage3Hovered] = useState(false);
  const [image4Hovered, setImage4Hovered] = useState(false);
  const [image5Hovered, setImage5Hovered] = useState(false);

  const [selectedImage1, setSelectedImage1] = useState<File | null>(null);
  const [selectedImage2, setSelectedImage2] = useState<File | null>(null);
  const [selectedImage3, setSelectedImage3] = useState<File | null>(null);
  const [selectedImage4, setSelectedImage4] = useState<File | null>(null);
  const [selectedImage5, setSelectedImage5] = useState<File | null>(null);
  // const [rupiahAmount, setRupiahAmount] = useState<number | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetCategory();
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  const onSubmit = async (formData: Products) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await AddProduct(formData);
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

  return (
    <main className="relative h-full w-full overflow-auto">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="flex flex-row items-center gap-2 pb-4">
        <BuildingStorefrontIcon className="h-8 w-8 text-[#252525]" />
        <div className="">
          <h2 className="text-lg text-[#252525]">Add New Product</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <div className="flex w-full items-start justify-between gap-8">
          <div className="relative flex h-[100vh] w-[65%] flex-col gap-8">
            <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll rounded-md bg-gray-50 p-5">
              <div>
                <h2 className="text-lg font-semibold text-[#252525]">
                  General Information
                </h2>
              </div>
              <InputField
                type="text"
                label="Name Product"
                placeholder="Name"
                register={register}
                width="w-[350px] md:w-full"
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "name",
                  autoComplete: "name",
                }}
                error={errors.name?.message}
              />
              <InputField
                type="text"
                label="Sub Descriptions"
                placeholder="Sub Descriptions"
                width="w-full"
                register={register}
                color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                inputProps={{
                  name: "subDescriptions",
                  autoComplete: "subDescriptions",
                }}
                error={errors.subDescriptions?.message}
              />
              <div className="flex w-full flex-col gap-2">
                <label className="font-josefins text-[16px] text-[#202020]">
                  Description Product
                </label>
                <div className="w-full max-w-2xl">
                  <Controller
                    name="descriptions"
                    control={control}
                    render={({ field }) => (
                      <ReactQuill
                        {...field}
                        theme="snow"
                        placeholder="Write product description..."
                      />
                    )}
                  />
                </div>
                {errors.descriptions && (
                  <p className="text-sm text-red-500">
                    {errors.descriptions.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between gap-2">
                <InputField
                  type="text"
                  label="Size"
                  placeholder="Size"
                  width="w-full"
                  register={register}
                  color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                  inputProps={{
                    name: "size",
                    autoComplete: "size",
                  }}
                  error={errors.size?.message}
                />
                <InputField
                  type="text"
                  label="Weight"
                  placeholder="Weight"
                  width="w-full"
                  register={register}
                  color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                  inputProps={{
                    name: "weight",
                    autoComplete: "weight",
                  }}
                  error={errors.weight?.message}
                />
              </div>
              <div className="flex justify-between gap-2">
                <InputField
                  type="text"
                  label="Rupiah"
                  placeholder="Rupiah"
                  width="w-full"
                  register={register}
                  color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                  inputProps={{
                    name: "priceIDR",
                    autoComplete: "rupiah",
                  }}
                  error={errors.priceIDR?.message}
                />
              </div>
              <div className="flex justify-between gap-2">
                <InputField
                  type="text"
                  label="Stock"
                  placeholder="Stock"
                  width="w-full"
                  register={register}
                  color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                  inputProps={{
                    name: "stock",
                    autoComplete: "stock",
                  }}
                  error={errors.stock?.message}
                />
                <InputField
                  type="text"
                  label="Max Order"
                  placeholder="Max Order"
                  width="w-full"
                  register={register}
                  color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                  inputProps={{
                    name: "maxOrder",
                    autoComplete: "maxOrder",
                  }}
                  error={errors.maxOrder?.message}
                />
              </div>
            </div>
          </div>
          <div className="flex w-[35%] flex-col gap-3">
            <div className="flex flex-col gap-4 rounded-md bg-gray-50 p-5">
              <div>
                <h2 className="text-lg font-semibold text-[#252525]">
                  Category
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="font-josefins text-[16px] text-[#252525]"
                >
                  Product Category
                </label>
                <Controller
                  control={control}
                  name="categoryId"
                  rules={{ required: "Please select an option" }}
                  render={({ field }) => (
                    <Listbox
                      as="div"
                      value={selectedCategory}
                      onChange={(selectedCategory) => {
                        setSelectedCategory(selectedCategory);
                        field.onChange(selectedCategory?.id || null);
                      }}
                    >
                      {({ open }) => (
                        <>
                          <div className="relative">
                            <Listbox.Button className="flex w-full cursor-pointer items-center justify-between rounded-md bg-white px-4 py-3 text-left font-josefins text-[#434343] ring-1 ring-[#434343] focus:ring-1 focus:ring-[#C1AE94] sm:text-sm">
                              <span>
                                {selectedCategory
                                  ? selectedCategory.name.toUpperCase()
                                  : "Select Category"}
                              </span>
                              <ChevronDownIcon
                                className={`h-5 w-5 transform transition-all duration-300 ${open ? "rotate-180" : ""}`}
                                aria-hidden="true"
                              />
                            </Listbox.Button>
                            <Transition
                              as="div"
                              show={open}
                              enter="transition duration-300 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-300 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Listbox.Options
                                as="ul"
                                className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                style={{ display: open ? "block" : "none" }}
                              >
                                {categories.map((category) => (
                                  <Listbox.Option
                                    as="li"
                                    key={category.id}
                                    value={category}
                                    className={({ active }) =>
                                      `${active ? "bg-[#C1AE94] text-white" : "text-gray-900"} relative cursor-pointer select-none py-2 pl-3 pr-9`
                                    }
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`${selected ? "text-[#434343]" : "text-black"} block truncate`}
                                        >
                                          {category.name.toUpperCase()}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`${active ? "text-white" : "text-[#C1AE94]/50"} absolute inset-y-0 right-0 flex items-center pr-4`}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
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
                {errors.categoryId && (
                  <p className="text-sm text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="flex h-[16.5rem] w-full flex-col gap-2">
                <Controller
                  control={control}
                  name={"image1"}
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
                            alt="Product"
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
                          htmlFor="imageUpload"
                          className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-[1px] border-dashed border-[#434343] transition-all duration-500 ease-in-out hover:bg-black hover:bg-opacity-10"
                        >
                          <input
                            {...field}
                            value={value?.image1}
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            onChange={(event) => {
                              const file =
                                event.target.files && event.target.files[0];
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
                {errors.image1 && (
                  <p className="text-sm text-red-500">
                    {errors.image1.message?.toString()}
                  </p>
                )}
              </div>
              <div className="flex h-full w-full justify-between">
                <div className="relative flex h-[6rem] w-[6rem] flex-col gap-2">
                  <Controller
                    control={control}
                    name={"image2"}
                    render={({ field: { value, onChange, ...field } }) => (
                      <>
                        {selectedImage2 ? (
                          <div
                            className="relative h-full w-full overflow-hidden rounded-md ring-[#C1AE94] hover:ring-1"
                            onMouseEnter={() => setImage2Hovered(true)}
                            onMouseLeave={() => setImage2Hovered(false)}
                          >
                            <Image
                              src={URL.createObjectURL(selectedImage2)}
                              alt="Product"
                              fill
                            />
                            {image2Hovered && (
                              <div
                                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                                onClick={() => setSelectedImage2(null)}
                              >
                                <TrashIcon className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <label
                            htmlFor="imageUpload"
                            className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-[1px] border-dashed border-[#434343] transition-all duration-500 ease-in-out hover:bg-black hover:bg-opacity-10"
                          >
                            <input
                              {...field}
                              value={value?.image2}
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={(event) => {
                                const file =
                                  event.target.files && event.target.files[0];
                                if (file) {
                                  onChange(file);
                                  setSelectedImage2(file);
                                }
                              }}
                            />
                            <PlusCircleIcon className="h-6 w-6 text-[#CDB698]" />
                          </label>
                        )}
                      </>
                    )}
                  />
                  {errors.image2 && (
                    <p className="absolute -bottom-16 text-xs text-red-500">
                      {errors.image2.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="relative flex h-[6rem] w-[6rem] flex-col gap-2">
                  <Controller
                    control={control}
                    name={"image3"}
                    render={({ field: { value, onChange, ...field } }) => (
                      <>
                        {selectedImage3 ? (
                          <div
                            className="relative h-full w-full overflow-hidden rounded-md ring-[#C1AE94] hover:ring-1"
                            onMouseEnter={() => setImage3Hovered(true)}
                            onMouseLeave={() => setImage3Hovered(false)}
                          >
                            <Image
                              src={URL.createObjectURL(selectedImage3)}
                              alt="Product"
                              fill
                            />
                            {image3Hovered && (
                              <div
                                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                                onClick={() => setSelectedImage3(null)}
                              >
                                <TrashIcon className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <label
                            htmlFor="imageUpload"
                            className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-[1px] border-dashed border-[#434343] transition-all duration-500 ease-in-out hover:bg-black hover:bg-opacity-10"
                          >
                            <input
                              {...field}
                              value={value?.image3}
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={(event) => {
                                const file =
                                  event.target.files && event.target.files[0];
                                if (file) {
                                  onChange(file);
                                  setSelectedImage3(file);
                                }
                              }}
                            />
                            <PlusCircleIcon className="h-6 w-6 text-[#CDB698]" />
                          </label>
                        )}
                      </>
                    )}
                  />
                  {errors.image3 && (
                    <p className="absolute -bottom-16 text-xs text-red-500">
                      {errors.image3.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="relative flex h-[6rem] w-[6rem] flex-col gap-2">
                  <Controller
                    control={control}
                    name={"image4"}
                    render={({ field: { value, onChange, ...field } }) => (
                      <>
                        {selectedImage4 ? (
                          <div
                            className="relative h-full w-full overflow-hidden rounded-md ring-[#C1AE94] hover:ring-1"
                            onMouseEnter={() => setImage4Hovered(true)}
                            onMouseLeave={() => setImage4Hovered(false)}
                          >
                            <Image
                              src={URL.createObjectURL(selectedImage4)}
                              alt="Product"
                              fill
                            />
                            {image4Hovered && (
                              <div
                                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                                onClick={() => setSelectedImage4(null)}
                              >
                                <TrashIcon className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <label
                            htmlFor="imageUpload"
                            className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-[1px] border-dashed border-[#434343] transition-all duration-500 ease-in-out hover:bg-black hover:bg-opacity-10"
                          >
                            <input
                              {...field}
                              value={value?.image4}
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={(event) => {
                                const file =
                                  event.target.files && event.target.files[0];
                                if (file) {
                                  onChange(file);
                                  setSelectedImage4(file);
                                }
                              }}
                            />
                            <PlusCircleIcon className="h-6 w-6 text-[#CDB698]" />
                          </label>
                        )}
                      </>
                    )}
                  />
                  {errors.image4 && (
                    <p className="absolute -bottom-16 text-xs text-red-500">
                      {errors.image4.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="relative flex h-[6rem] w-[6rem] flex-col gap-2">
                  <Controller
                    control={control}
                    name={"image5"}
                    render={({ field: { value, onChange, ...field } }) => (
                      <>
                        {selectedImage5 ? (
                          <div
                            className="relative h-full w-full overflow-hidden rounded-md ring-[#C1AE94] hover:ring-1"
                            onMouseEnter={() => setImage5Hovered(true)}
                            onMouseLeave={() => setImage5Hovered(false)}
                          >
                            <Image
                              src={URL.createObjectURL(selectedImage5)}
                              alt="Product"
                              fill
                            />
                            {image5Hovered && (
                              <div
                                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                                onClick={() => setSelectedImage5(null)}
                              >
                                <TrashIcon className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <label
                            htmlFor="imageUpload"
                            className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-[1px] border-dashed border-[#434343] transition-all duration-500 ease-in-out hover:bg-black hover:bg-opacity-10"
                          >
                            <input
                              {...field}
                              value={value?.image5}
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={(event) => {
                                const file =
                                  event.target.files && event.target.files[0];
                                if (file) {
                                  onChange(file);
                                  setSelectedImage5(file);
                                }
                              }}
                            />
                            <PlusCircleIcon className="h-6 w-6 text-[#CDB698]" />
                          </label>
                        )}
                      </>
                    )}
                  />
                  {errors.image5 && (
                    <p className="absolute -bottom-16 text-xs text-red-500">
                      {errors.image5.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <ButtonPrimary text="Add Product" height="h-[50px]" />
          </div>
        </div>
      </form>
    </main>
  );
}
