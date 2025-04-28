"use client";

import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

interface SearchFormValues {
  query: string;
}

export const SearchBar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>();
  const router = useRouter();

  const onSubmit = (data: SearchFormValues) => {
    if (data.query.trim()) {
      router.push(`/search?query=${encodeURIComponent(data.query)}`);
      onClose(); // Close the search bar after submitting
    }
  };

  return (
    <>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[15rem] rounded-md border border-[#C1AE94] bg-white shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="p-2">
            <input
              type="text"
              placeholder="Search..."
              {...register("query", {
                required: "Search term is required",
              })}
              className="w-full rounded-md border border-[#C1AE94] px-3 py-2 text-sm outline-none focus:border-[#C1AE94] focus:outline-none"
            />
            {errors.query && (
              <p className="text-xs text-red-500">{errors.query.message}</p>
            )}
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-[#C1AE94] py-1 text-white"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </>
  );
};
