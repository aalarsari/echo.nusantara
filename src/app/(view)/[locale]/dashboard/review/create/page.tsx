"use client";

import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonPrimary, InputField, Notifications } from "@/components/atoms";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CreateReviewValidation } from "@/lib/zod-schema/review";
import { CreateReviewAdmin } from "@/controller/admin/review";
import dynamic from "next/dynamic";
import StarRatings from "react-star-ratings";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function CreateReview() {
  type Review = z.infer<typeof CreateReviewValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Review>();

  const [rating, setRating] = useState(0);
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

  const onSubmit = async (formData: Review) => {
    const reviewData = { ...formData, rating };
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await CreateReviewAdmin(reviewData);

      if (response.status === 200) {
        showNotification("Review created successfully!", "success", 1000);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const responseData = await response.json();
        const errorMessage = responseData.message;
        showNotification(`Internal Server Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error creating Review:", error);
      showNotification(
        "Internal Server Error: Failed to create Review.",
        "error",
      );
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
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
    }),
    [],
  );

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
                  <h2 className="text-lg font-semibold text-[#252525]">
                    Review
                  </h2>
                </div>
                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full flex-col gap-4 md:flex-row">
                    <div className="h-[200px] w-[200px]">
                      <div className="flex h-full w-[200px] flex-col gap-2">
                        <Controller
                          control={control}
                          name={"photo"}
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <>
                              {selectedImages ? (
                                <div
                                  className="relative h-full w-full overflow-hidden rounded-md ring-[#C1AE94] hover:ring-1"
                                  onMouseEnter={() => setImageHovered(true)}
                                  onMouseLeave={() => setImageHovered(false)}
                                >
                                  <Image
                                    src={URL.createObjectURL(selectedImages)}
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
                        {errors.photo && (
                          <p className="text-sm text-red-500">
                            {errors.photo.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full flex-col justify-between gap-4">
                      <div className="flex w-full flex-col gap-2">
                        <label
                          htmlFor="rating"
                          className="font-josefins text-[16px] text-[#ADADAD]"
                        >
                          Rating
                        </label>
                        <StarRatings
                          rating={rating}
                          starRatedColor="orange"
                          starEmptyColor="lightgray"
                          numberOfStars={5}
                          name="rating"
                          starDimension="30px"
                          starSpacing="5px"
                          changeRating={(newRating) => setRating(newRating)}
                        />
                      </div>
                      <div className="flex w-full flex-col gap-4 md:flex-row">
                        <InputField
                          type="text"
                          label="Name"
                          placeholder="Name"
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
                          label="Title"
                          placeholder="Title"
                          register={register}
                          width="w-full"
                          color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                          inputProps={{
                            name: "title",
                            autoComplete: "title",
                          }}
                          error={errors.title?.message}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <label className="font-josefins text-[16px] text-[#ADADAD]">
                      Review Description
                    </label>
                    <div className="w-full max-w-[69rem]">
                      <Controller
                        name="review"
                        control={control}
                        render={({ field }) => (
                          <ReactQuill
                            {...field}
                            value={field.value || ""}
                            theme="snow"
                            formats={formats}
                            modules={modules}
                            placeholder="Write review description..."
                          />
                        )}
                      />
                    </div>
                    {errors.review && (
                      <p className="text-sm text-red-500">
                        {errors.review.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-start gap-4">
            <ButtonPrimary
              width="w-[48%]"
              height="h-[50px]"
              text="Add Review"
            />
          </div>
        </div>
      </form>
    </main>
  );
}
