"use client";

import React, { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { ButtonPrimary, InputField, Notifications } from "@/components/atoms";
import { CreateBlog } from "@/controller/admin/blog";
import { CreateBlogValidation } from "@/lib/zod-schema/blog";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function BuatNews() {
  type Blog = z.infer<typeof CreateBlogValidation>;
  const quill = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Blog>();
  const router = useRouter();
  const [imageHovered, setImageHovered] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (formData: Blog) => {
    try {
      const base64Images =
        selectedImages.length > 0
          ? await Promise.all(
              selectedImages.map((image) => fileToBase64(image)),
            )
          : [];
      const updatedFormData = {
        ...formData,
        image: base64Images,
      };

      const response = await CreateBlog(updatedFormData);

      if (response.status === 200) {
        showNotification("News created successfully!", "success", 1000);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const responseData = await response.json();
        const errorMessage = responseData.message;
        showNotification(`Internal Server Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error creating news:", error);
      showNotification(
        "Internal Server Error: Failed to create news.",
        "error",
      );
    }
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ align: ["right", "center", "justify"] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: true,
      },
    };
  }, []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
    "align",
  ];

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
                  <h2 className="text-lg font-semibold text-[#252525]">News</h2>
                </div>
                <div className="flex w-full flex-col gap-6">
                  <div className="flex w-[350px] flex-col gap-2 md:w-full">
                    <div className="relative flex h-[20rem] flex-col gap-2">
                      <Controller
                        control={control}
                        name="image"
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <>
                            {selectedImages.length > 0 ? (
                              <div
                                className="relative h-full w-full overflow-hidden rounded-md"
                                onMouseEnter={() => setImageHovered(true)}
                                onMouseLeave={() => setImageHovered(false)}
                              >
                                <Image
                                  src={URL.createObjectURL(selectedImages[0])}
                                  alt="Selected"
                                  fill
                                  style={{ objectFit: "contain" }}
                                />
                                {imageHovered && (
                                  <div
                                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                                    onClick={() => {
                                      setSelectedImages([]);
                                      onChange([]);
                                    }}
                                  >
                                    <TrashIcon className="h-10 w-10 text-white" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <label
                                htmlFor="imageUpload"
                                className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-[1px] border-dashed border-[#252525] transition-all duration-500 ease-in-out hover:bg-black hover:bg-opacity-10"
                              >
                                <input
                                  type="file"
                                  id="imageUpload"
                                  accept="image/*"
                                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                  ref={ref}
                                  onChange={(event) => {
                                    const files = event.target.files
                                      ? Array.from(event.target.files)
                                      : [];
                                    setSelectedImages(files);
                                    onChange(files);
                                  }}
                                  onBlur={onBlur}
                                />
                                <PlusCircleIcon className="h-8 w-8 text-[#252525]" />
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
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between gap-4">
                      <InputField
                        type="text"
                        label="Title"
                        placeholder="Title"
                        register={register}
                        width="w-[350px] md:w-full"
                        color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                        inputProps={{
                          name: "title",
                          autoComplete: "title",
                        }}
                        error={errors.title?.message}
                      />
                      <InputField
                        type="text"
                        label="Topics"
                        placeholder="Topics"
                        register={register}
                        width="w-[350px] md:w-full"
                        color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                        inputProps={{
                          name: "category",
                          autoComplete: "category",
                        }}
                        error={errors.category?.message}
                      />
                    </div>
                    <InputField
                      type="text"
                      label="Subtitle"
                      placeholder="Subtitle"
                      register={register}
                      width="w-[350px] md:w-full"
                      color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                      inputProps={{
                        name: "subtitle",
                        autoComplete: "subtitle",
                      }}
                      error={errors.subtitle?.message}
                    />
                    <div className="flex w-full flex-col gap-2">
                      <label className="font-josefins text-[16px] text-[#ADADAD]">
                        Blog
                      </label>
                      <div className="w-full max-w-[69rem]">
                        <Controller
                          name="content"
                          control={control}
                          render={({ field }) => (
                            <ReactQuill
                              {...field}
                              value={field.value || ""}
                              theme="snow"
                              formats={formats}
                              modules={modules}
                              placeholder="Write news description..."
                            />
                          )}
                        />
                      </div>
                      {errors.content && (
                        <p className="text-sm text-red-500">
                          {errors.content.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ButtonPrimary text="Create News" width="w-[49%]" height="h-[48px]" />
        </div>
      </form>
    </main>
  );
}
