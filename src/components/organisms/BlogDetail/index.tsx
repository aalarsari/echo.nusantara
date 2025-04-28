"use client";

import { ButtonPrimary, InputField, Notifications } from "@/components/atoms";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import dynamic from "next/dynamic";

import { UpdateBlogValidation } from "@/lib/zod-schema/blog";
import { GetDetailBlog, UpdateBlog } from "@/controller/admin/blog";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface BlogDetailProps {
  slug: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ slug }) => {
  const [imageHovered, setImageHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  type Blog = z.infer<typeof UpdateBlogValidation>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<Blog>({});

  const [newsDetails, setNewsDetails] = useState<Blog | null>(null);
  const router = useRouter();
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

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await GetDetailBlog(slug);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const news = await response.json();
        setNewsDetails(news.data as Blog);
      } catch (error) {
        console.error("Error fetching news details:", error);
      }
    };
    fetchNewsDetails();
  }, [slug]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(fileURL);
    }
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
      const imageArray = selectedImage
        ? [await fileToBase64(selectedImage)]
        : null;

      const response = await UpdateBlog(
        { ...formData, image: imageArray },
        slug,
      );

      if (response.status === 200) {
        showNotification("Product updated successfully!", "success");
        setTimeout(() => {
          router.push("/dashboard/news");
        }, 1000);
      } else {
        const responseData = await response.json();
        const errorMessage = responseData.message;
        showNotification(`Internal Server Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      const errorMessage = "Internal Server Error: Failed to update news.";
      showNotification(errorMessage, "error");
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

  useEffect(() => {
    if (newsDetails?.content) {
      setValue("content", newsDetails.content);
    }
    if (newsDetails?.image) {
      setPreviewUrl(newsDetails.image[0]);
    }
    setValue("title", newsDetails?.title || "");
    setValue("subtitle", newsDetails?.subtitle || "");
  }, [newsDetails, setValue]);

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
                    <div className="relative flex h-[20rem] cursor-pointer flex-col gap-2">
                      <div
                        className="relative h-full w-full overflow-hidden rounded-md"
                        onMouseEnter={() => setImageHovered(true)}
                        onMouseLeave={() => setImageHovered(false)}
                      >
                        {previewUrl ? (
                          <>
                            <Image
                              fill
                              src={previewUrl}
                              alt="Selected"
                              className="h-full w-full object-contain"
                            />
                            {imageHovered && (
                              <div
                                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
                                onClick={() => {
                                  setSelectedImage(null);
                                  setPreviewUrl(null);
                                }}
                              >
                                <TrashIcon className="h-10 w-10 text-white" />
                              </div>
                            )}
                          </>
                        ) : (
                          <label
                            htmlFor="imageUpload"
                            className="relative flex h-full w-full transform cursor-pointer items-center justify-center rounded-md border-[1px] border-dashed border-[#252525]"
                          >
                            <input
                              type="file"
                              id="imageUpload"
                              accept="image/*"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={handleFileChange}
                            />
                            <PlusCircleIcon className="h-8 w-8 text-[#252525]" />
                          </label>
                        )}
                      </div>
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
                        placeholder={newsDetails?.title || "Title"}
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
                        label="Subtitle"
                        placeholder={newsDetails?.subtitle || "Subtitle"}
                        register={register}
                        width="w-[350px] md:w-full"
                        color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                        inputProps={{
                          name: "subtitle",
                          autoComplete: "subtitle",
                        }}
                        error={errors.subtitle?.message}
                      />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      <label className="font-josefins text-[16px] text-[#ADADAD]">
                        News
                      </label>
                      <div className="w-full max-w-[69rem]">
                        <Controller
                          name="content"
                          control={control}
                          defaultValue={newsDetails?.content || ""}
                          render={({ field }) => (
                            <ReactQuill
                              {...field}
                              value={field.value || ""}
                              onChange={field.onChange}
                              modules={modules}
                              formats={formats}
                              theme="snow"
                            />
                          )}
                        />
                        {errors.content && (
                          <p className="text-sm text-red-500">
                            {errors.content.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-start">
                <ButtonPrimary
                  width="w-[49%]"
                  text="Update News"
                  height="h-[50px]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};
