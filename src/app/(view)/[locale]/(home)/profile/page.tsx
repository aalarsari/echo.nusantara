"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MyOrder, MyPassword, MyProfile } from "@/components";
import { Profile } from "@/controller/user/profile";
import { MyWishlist } from "@/components/molecules/MyWishlist";
import moment from "moment";

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

  const handleMenuClick = (menuItem: string) => {
    router.push(`?menu=${menuItem}`);
  };

  return (
    <div className="flex h-full w-full flex-col pt-20">
      <div className="relative h-[14rem] px-10 flex lg:flex-row flex-col gap-2 justify-center lg:justify-between items-center w-full bg-[#F4F4F4]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[52px] text-center lg:text-left text-[#323232] font-medium font-domaine">
            Hallo, {profileData?.name ?? "Name"}
          </h2>
          <h2 className="text-[16px] text-center lg:text-left text-[#323232] font-medium font-domaine">
            Last Update{" "}
            {profileData?.updateAt
              ? moment(profileData.updateAt).format("DD MMMM YYYY")
              : moment(profileData?.createdAt).format("DD MMMM YYYY")}
          </h2>
        </div>
        <button
          onClick={() => handleMenuClick("My Account")}
          className="h-[50px] w-[238px] rounded-full bg-[#B69B7C] font-josefins text-white text-[16px]"
        >
          Edit Profile
        </button>
      </div>
      <div className="flex h-full w-full flex-col  lg:flex-row">
        <div className="relative flex h-auto py-8 lg:py-10 px-8 w-full flex-col items-start justify-start gap-4  border-t-[1px] border-gray-200 lg:h-[105vh] lg:w-[25%]">
          <div className="w-full">
            <ul>
              {[
                "My Account",
                "My Orders",
                "My Wishlist",
                "Change Password",
                "Logout",
              ].map((item) => (
                <li
                  key={item}
                  className={`font-regular w-full transform cursor-pointer text-[14px] lg:text-[24px] px-4 py-4 lg:py-2 font-josefins text-[#7D716A] transition-all duration-300  hover:bg-[#B69B78]/[22%] ${
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
        <div className="relative flex h-full w-full flex-col items-start justify-start gap-2 overflow-hidden  border-t-[1px] border-l-[1px] border-gray-200 lg:h-[105vh] lg:w-[75%]">
          <div className="w-full  px-4 pt-8 font-domaine text-[32px] text-[#323232]">
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
