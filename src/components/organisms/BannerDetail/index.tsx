"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import {
  BannerValidation,
  UpdateBannerValidation,
} from "@/lib/zod-schema/banner";
import Image from "next/image";
import { ButtonPrimary, InputField } from "@/components/atoms";
import {
  BannerData,
  UpdateBanner,
  UpdateDetailBanner,
} from "@/controller/admin/banner";
import { Notifications } from "@/components/atoms";
import { $Enums, Banner, CategoryBanner } from "@prisma/client";
import { z } from "zod";
import { Assets } from "@/assets";

interface BannerDetailProps {
  id: string;
}

export const BannerDetail: React.FC<BannerDetailProps> = ({ id }) => {
  type Banners = z.infer<typeof UpdateBannerValidation>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<Banners>({
    resolver: zodResolver(UpdateBannerValidation),
  });

  const [bannerDetails, setBannersDetails] = useState<Banner | null>(null);
  const router = useRouter();
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryBanner | null>(null);
  const [availableCategory, setAvailableCategory] = useState<CategoryBanner[]>(
    [],
  );

  const [previewUrls, setPreviewUrls] = useState<{ path: string | null }>({
    path: null,
  });
  const [selectedFiles, setSelectedFiles] = useState<{ path: File | null }>({
    path: null,
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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: keyof Banners,
  ) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      console.log("File selected:", file);

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log("Base64 String:", base64String);

        const cleanedBase64String = base64String.replace(
          /^data:image\/(jpeg|png|gif);base64,/,
          "",
        );
        console.log("Cleaned Base64 String:", cleanedBase64String);

        setSelectedFiles((prevState) => ({ ...prevState, [key]: file }));
        setPreviewUrls((prevState) => ({
          ...prevState,
          [key]: base64String,
        }));

        setValue(key, cleanedBase64String);
      };

      reader.readAsDataURL(file);
    } else {
      setValue(key, "");
    }
  };

  const onSubmit = async (data: Banners) => {
    console.log(data, "dataa");
    try {
      const filePath =
        selectedFiles.path instanceof File
          ? await convertFileToBase64(selectedFiles.path)
          : selectedFiles.path;

      const cleanedFilePath = filePath
        ? filePath.replace(/^data:image\/[a-z]+;base64,/, "")
        : "";

      const formData: Banners = {
        title: data.title,
        subtitle: data.subtitle,
        category: selectedCategory || data.category,
        path: cleanedFilePath || "",
      };

      const response = await UpdateDetailBanner(formData, parseInt(id));

      if (response.ok) {
        showNotification("Banner updated successfully", "success");
      } else {
        throw new Error("Failed to update banner");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showNotification("Error submitting form", "error");
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
    });
  };

  useEffect(() => {
    const allCategory: CategoryBanner[] = Object.values($Enums.CategoryBanner);
    setAvailableCategory(allCategory);
  }, []);

  useEffect(() => {
    const fetchBannerDetails = async () => {
      try {
        const response = await BannerData(id);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const banner = await response.json();
        setBannersDetails(banner.data as Banner);
      } catch (error) {
        console.error("Error fetching banner details:", error);
      }
    };
    fetchBannerDetails();
  }, [id]);

  useEffect(() => {
    if (bannerDetails?.title) {
      setValue("title", bannerDetails.title);
    }
    setValue("subtitle", bannerDetails?.subtitle || "");
  }, [bannerDetails, setValue]);

  useEffect(() => {
    return () => {
      previewUrls.path && URL.revokeObjectURL(previewUrls.path);
    };
  }, [previewUrls.path]);

  return (
    <main className="relative h-full w-full overflow-auto">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="flex flex-row items-center gap-2 pb-4">
        <PhotoIcon className="h-8 w-8 text-[#252525]" />
        <div className="">
          <h2 className="text-lg text-[#252525]">Detail Banner</h2>
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
                    <div className="flex w-[350px] flex-col gap-2 md:w-full">
                      <div className="relative flex h-[20rem] cursor-pointer flex-col gap-2">
                        <div className="flex w-full flex-col gap-2 lg:w-[25%]">
                          <div className="group relative h-[15rem] w-full overflow-hidden rounded-md">
                            <Controller
                              name="path"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <Image
                                    src={
                                      bannerDetails?.path ||
                                      previewUrls.path ||
                                      field.value ||
                                      Assets.DefaultImage
                                    }
                                    alt="Product Image"
                                    fill
                                    priority={true}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{ objectFit: "contain" }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:bg-opacity-70 group-hover:opacity-100">
                                    <label
                                      htmlFor="file-input-1"
                                      className="cursor-pointer"
                                    >
                                      <Image
                                        src={Assets.IconTrash}
                                        alt="Trash Icon"
                                        width={48}
                                        height={48}
                                        className="text-white"
                                      />
                                    </label>
                                    <input
                                      id="file-input-1"
                                      type="file"
                                      accept="image/jpeg, image/png"
                                      onChange={(e) =>
                                        handleFileChange(e, "path")
                                      }
                                      className="hidden"
                                    />
                                  </div>
                                </>
                              )}
                            />
                          </div>
                        </div>
                        {errors.path && (
                          <p className="text-sm text-red-500">
                            {errors.path.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <InputField
                      type="text"
                      label="Title"
                      placeholder={bannerDetails?.title || "Title"}
                      register={register}
                      width="w-[350px] md:w-full"
                      color="bg-white ring-[0.5px] ring-gray-100 text-[#ccc]"
                      inputProps={{
                        name: "title",
                        autoComplete: "title",
                      }}
                      error={errors.title?.message}
                    />
                    <InputField
                      type="text"
                      label="Subtitle"
                      placeholder={bannerDetails?.subtitle || "Subtitle"}
                      register={register}
                      width="w-[350px] md:w-full"
                      color="bg-white ring-[0.5px] ring-gray-100 text-[#ccc]"
                      inputProps={{
                        name: "subtitle",
                        autoComplete: "subtitle",
                      }}
                      error={errors.subtitle?.message}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <label htmlFor="role" className="text-md text-[#252525]">
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
                                <Listbox.Button className="flex h-[50px] w-full cursor-pointer items-center justify-between rounded-md bg-white px-4 py-3 text-left text-[#252525] text-[16pxh] outline-none ring-[0.5px] ring-[#7D716A] focus:ring-[0.5px] focus:ring-[#7D716A]">
                                  <span>
                                    {selectedCategory ||
                                      field.value ||
                                      bannerDetails?.category ||
                                      "Pilih Roles"}
                                    {/* Display the selected role or the field value */}
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
                                    className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-[0.5px] ring-[#7D716A] focus:outline-none sm:text-sm"
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
          <ButtonPrimary
            text="Update Content"
            width="w-[49%]"
            height="h-[48px]"
          />
        </div>
      </form>
    </main>
  );
};
