"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ButtonPrimary, InputField } from "@/components/atoms";
import { Notifications } from "@/components/atoms";
import { ContactValidations } from "@/lib/zod-schema/contact";
import { CreateContactAdmin } from "@/controller/admin/contact";
import { $Enums } from "@prisma/client";

export default function CreateContact() {
  type Contact = z.infer<typeof ContactValidations>;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Contact>({
    resolver: zodResolver(ContactValidations),
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

  const onSubmit = async (formData: Contact) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await CreateContactAdmin(formData);

      if (response.status === 200) {
        showNotification("Contact created successfully!", "success", 1000);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const responseData = await response.json();
        const errorMessage = responseData.message;
        showNotification(`Internal Server Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      showNotification(
        "Internal Server Error: Failed to create contact.",
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
        <h2 className="text-lg text-[#252525]">Add New Contact</h2>
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
                      label="Email"
                      placeholder="Email"
                      register={register}
                      width="w-[350px] md:w-full"
                      color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                      inputProps={{
                        name: "email",
                        autoComplete: "email",
                      }}
                      error={errors.email?.message}
                    />
                  </div>
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
                  <div className="flex justify-between gap-4">
                    <div className="w-[350px] md:w-full">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category
                      </label>
                      <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                          <select
                            {...field}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                          >
                            <option value={""} disabled>
                              Select Category
                            </option>
                            <option
                              value={$Enums.QuestionsUserCategory.BUSINESS}
                            >
                              Business
                            </option>
                            <option
                              value={$Enums.QuestionsUserCategory.GENERAL}
                            >
                              General
                            </option>
                          </select>
                        )}
                      />
                      {errors.category && (
                        <span className="text-sm text-red-600">
                          {errors.category.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ButtonPrimary text="Add Contact" width="w-[49%]" height="h-[48px]" />
        </div>
      </form>
    </main>
  );
}
