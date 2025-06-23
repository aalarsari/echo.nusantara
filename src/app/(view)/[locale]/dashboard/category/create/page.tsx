"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ButtonPrimary, InputField } from "@/components/atoms";
import { Notifications } from "@/components/atoms";
import { CategoryValidation } from "@/lib/zod-schema/category";
import { CreateCategory } from "@/controller/admin/category";

export default function CreateCategorys() {
  type Categorys = z.infer<typeof CategoryValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Categorys>({
    resolver: zodResolver(CategoryValidation),
  });
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

  const onSubmit = async (formData: Categorys) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await CreateCategory(formData);

      if (response.status === 200) {
        showNotification("Category created successfully!", "success", 1000);
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

  return (
    <main className="relative h-full w-full">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="flex flex-row items-center gap-2 pb-4">
        <div className="">
          <h2 className="text-lg text-[#252525]">Add New Category</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-start justify-between gap-8">
            <div className="flex w-full flex-col gap-8">
              <div className="flex w-full flex-col gap-4 rounded-md bg-gray-50 p-5">
                <div className="flex w-full flex-col gap-6">
                  <div className="flex justify-between gap-4">
                    <InputField
                      type="text"
                      label="Name"
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
                      label="Description"
                      placeholder="Description"
                      register={register}
                      width="w-[350px] md:w-full"
                      color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                      inputProps={{
                        name: "description",
                        autoComplete: "description",
                      }}
                      error={errors.description?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ButtonPrimary
            text="Add Category"
            width="w-[49%]"
            height="h-[48px]"
          />
        </div>
      </form>
    </main>
  );
}
