"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import { MyOrder, MyPassword, MyProfile } from "@/components";
import { Profile } from "@/controller/user/profile";
import { MyWishlist } from "@/components/molecules/MyWishlist";

export default function ProfileComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const menu = searchParams.get("menu") || "My Account";

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await Profile();
      const { data } = response;
      setProfileData(data);
      setPreviewUrl(data.photo ?? null);
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getImageSrc = () => {
    if (previewUrl) {
      return previewUrl;
    }
    return Assets.Forest;
  };

  const handleMenuClick = (menuItem: string) => {
    router.push(`?menu=${menuItem}`);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 px-6 py-20 lg:h-[120vh] lg:p-20">
      <div className="flex h-full w-full flex-col gap-2 rounded-md lg:flex-row">
        <div className="relative flex h-[18rem] w-full flex-col items-start justify-start gap-4 rounded-md ring-1 ring-gray-200 lg:h-[105vh] lg:w-[25%]">
          <div className="relative mx-2 mt-4 flex h-[6rem] w-[95%] flex-row items-center gap-2 overflow-hidden rounded-md px-2 md:h-[4.5rem]">
            <div className="relative h-24 w-24 overflow-hidden md:h-16 md:w-16">
              <Image
                src={getImageSrc()}
                alt="Photo Profile"
                fill
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-josefins text-[18px] font-light text-[#252525] md:text-[16px]">
                Hello
              </span>
              <span className="font-regular font-josefins text-[18px] text-[#92734E] md:text-[16px]">
                {profileData?.name || "Name"}
              </span>
            </div>
          </div>
          <div className="w-full">
            <ul>
              {[
                "My Account",
                "My Orders",
                "My Wishlist",
                "Change Password",
              ].map((item) => (
                <li
                  key={item}
                  className={`font-regular w-full transform cursor-pointer border-l-[2.5px] px-4 py-2 font-josefins text-[#7D716A] transition-all duration-300 hover:border-l-[2.5px] hover:border-[#7D716A] hover:bg-[#B69B78]/[22%] ${
                    menu === item
                      ? "border-[#7D716A] bg-[#B69B78]/[22%]"
                      : "border-transparent"
                  }`}
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Content Display Area */}
        <div className="relative flex h-full w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-md ring-1 ring-gray-200 lg:h-[105vh] lg:w-[75%]">
          <div className="w-full border-b-[1px] border-gray-200 p-4 font-josefins text-[20px] text-[#92734E]">
            {menu}
          </div>
          <div className="h-full w-full p-4">
            {menu === "My Account" && <MyProfile />}
            {menu === "My Orders" && <MyOrder />}
            {menu === "My Wishlist" && <MyWishlist />}
            {menu === "Change Password" && <MyPassword />}
          </div>
        </div>
      </div>
    </div>
  );
}
