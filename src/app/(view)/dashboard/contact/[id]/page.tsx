"use client";

import React, { useEffect, useState } from "react";
import { ContactValidations } from "@/lib/zod-schema/contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetDetailContactAdmin } from "@/controller/admin/contact";
import { InputField } from "@/components";

interface Contact {
  id: number;
  nama: string;
  email: string;
  title: string;
  Desciriptions: string;
  category: string;
  createdAt: string;
  nohandphone: string;
}

export default function ContactDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [contactDetails, setContactDetails] = useState<Contact | null>(null);

  const {
    register,
    formState: { errors },
  } = useForm<Contact>({
    resolver: zodResolver(ContactValidations),
  });

  useEffect(() => {
    const fetchContact = async (id: string) => {
      try {
        const res = await GetDetailContactAdmin(parseInt(params.id));
        const body = await res.json();

        if (Array.isArray(body.data) && body.data.length > 0) {
          setContactDetails(body.data[0]);
        } else {
          console.error("Unexpected response format:", body);
        }
      } catch (error) {
        console.error("Error fetching contact details:", error);
      }
    };

    fetchContact(params.id);
  }, [params.id]);

  return (
    <main className="relative h-full w-full">
      <div className="flex flex-row items-center gap-2 pb-4">
        <h2 className="text-lg text-[#252525]">Detail Contact</h2>
      </div>
      <form className="flex w-full flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-start justify-between gap-8">
            <div className="flex w-full flex-col gap-8">
              <div className="flex w-full flex-col gap-4 rounded-md bg-gray-50 p-5">
                <div className="flex w-full flex-col gap-6">
                  <div className="flex justify-between gap-4">
                    <InputField
                      type="text"
                      label="Name"
                      placeholder={contactDetails?.nama || "Nama"}
                      register={register}
                      width="w-[350px] md:w-full"
                      color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                      inputProps={{
                        name: "nama",
                        autoComplete: "nama",
                      }}
                      error={errors.nama?.message}
                    />
                    <InputField
                      type="text"
                      label="Email"
                      placeholder={contactDetails?.email || "Email"}
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
                      placeholder={contactDetails?.title || "Title"}
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
                      label="Category"
                      placeholder={contactDetails?.category || "Category"}
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
                  <div className="flex justify-between gap-4">
                    <InputField
                      type="text"
                      label="Description"
                      placeholder={
                        contactDetails?.Desciriptions || "Description"
                      }
                      register={register}
                      width="w-[350px] md:w-full"
                      color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                      inputProps={{
                        name: "Desciriptions",
                        autoComplete: "Desciriptions",
                      }}
                      error={errors.Desciriptions?.message}
                    />
                  </div>
                  <div className="flex justify-between gap-4">
                    <InputField
                      type="text"
                      label="No Handpone"
                      placeholder={
                        contactDetails?.nohandphone || "No Handphone"
                      }
                      register={register}
                      width="w-[350px] md:w-full"
                      color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                      inputProps={{
                        name: "nohandphone",
                        autoComplete: "nohandphone",
                      }}
                      error={errors.nohandphone?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
