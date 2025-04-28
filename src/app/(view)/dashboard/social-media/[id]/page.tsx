"use client";

import React, { useEffect, useState } from "react";

import {
  DetailSocialMedia,
  UpdateSocailMedia,
} from "@/controller/admin/social-media";
import { ButtonPrimary, InputField, Notifications } from "@/components";
import { SocialMediaValidation } from "@/lib/zod-schema/socialMedia";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function SocialMediaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [socialMediaDetail, setSocialMediaDetail] =
    useState<SocialMedia | null>(null);

  const router = useRouter();
  type SocialMedia = z.infer<typeof SocialMediaValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SocialMedia>({});

  const [imageHovered, setImageHovered] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File>();

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

  useEffect(() => {
    const fetchSocialMedia = async (id: string) => {
      try {
        const res = await DetailSocialMedia(parseInt(params.id));
        const body = await res.json();
        setSocialMediaDetail(body.data);
        console.log("Social Media Detail:", socialMediaDetail);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };
    fetchSocialMedia(params.id);
    return () => {};
  }, [params.id]);

   const onSubmit = async (formData: SocialMedia) => {
      const data = {
         name: formData.name ?? null,
         link: formData.link ?? null,
         image: formData.image ?? null,
      };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await UpdateSocailMedia(data, parseInt(params.id));
      if (response.status === 200) {
        showNotification("User updated successfully!", "success");
        setTimeout(() => {
          router.push("/dashboard/social-media");
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
    <main className="relative h-full w-full overflow-y-auto">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-start justify-between gap-8">
            <div className="flex w-full flex-col gap-8">
              <div className="flex w-full flex-col gap-4 rounded-md bg-gray-50 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#252525]">
                    Social Media
                  </h2>
                </div>
                <div className="flex w-full flex-row gap-4">
                  <div className="w-[200px flex h-[200px]">
                    <div className="flex h-full w-[200px] flex-col gap-2">
                      <Controller
                        control={control}
                        name={"image"}
                        render={({ field: { value, onChange, ...field } }) => (
                          <>
                            {selectedImages ? (
                              <div
                                className="relative h-full w-full overflow-hidden rounded-md ring-[#C1AE94] hover:ring-1"
                                onMouseEnter={() => setImageHovered(true)}
                                onMouseLeave={() => setImageHovered(false)}
                              >
                                <Image
                                  src={
                                    selectedImages
                                      ? URL.createObjectURL(selectedImages)
                                      : socialMediaDetail?.image
                                  }
                                  alt="Image"
                                  fill
                                />

                                {imageHovered && (
                                  <div
                                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                                    onClick={() => setSelectedImages(null!)}
                                  >
                                    <TrashIcon className="h-10 w-10 text-white" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <label
                                htmlFor="image"
                                className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-all duration-500 ease-in-out hover:bg-black hover:bg-opacity-10"
                              >
                                <input
                                  {...field}
                                  value={value?.image}
                                  id="image"
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                  onChange={(event) => {
                                    const file =
                                      event.target.files &&
                                      event.target.files[0];
                                    if (file) {
                                      onChange(file);
                                      setSelectedImages(file);
                                    }
                                  }}
                                />
                                <PlusCircleIcon className="h-8 w-8 text-[#CDB698]" />
                              </label>
                            )}
                          </>
                        )}
                      />
                      {errors.image && (
                        <p className="text-sm text-red-500">
                          {errors.image.message?.toString()}
                        </p>
                      )}
                    </div>
                  </div>

                           <div className="flex w-full flex-col gap-4">
                              <InputField
                                 type="text"
                                 label="Name"
                                 placeholder={socialMediaDetail?.name || "Name"}
                                 register={register}
                                 width="w-full"
                                 color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                                 inputProps={{
                                    name: "name",
                                    autoComplete: "name",
                                 }}
                                 error={errors.name?.message}
                              />
                              <InputField
                                 type="text"
                                 label="Link"
                                 placeholder={socialMediaDetail?.link || "Link"}
                                 register={register}
                                 width="w-full"
                                 color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                                 inputProps={{
                                    name: "link",
                                    autoComplete: "link",
                                 }}
                                 error={errors.link?.message}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <ButtonPrimary text="Update Social Media" width="w-[49%]" height="h-[48px]" />
            </div>
         </form>
      </main>
   );
}
