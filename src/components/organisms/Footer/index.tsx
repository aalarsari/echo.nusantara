"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Assets } from "@/assets";
import Link from "next/link";
import { GetSocialMedia } from "@/controller/noAuth/social-media";

export const Footer = () => {
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>([]);

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const response = await GetSocialMedia();
        const result = await response.json();
        const social = result.data.socialMedia;
        setSocialMediaLinks(social);
      } catch (err) {
        console.error("Failed to fetch social media");
      }
    };
    fetchSocial();
  }, []);

  const locations = [
    {
      title: "Jakarta Head Office",
      address:
        "Sahid Sudirman Centre 50th floor, Jl Jenderal Sudirman No 86, Jakarta, Indonesia 10220.",
    },
    {
      title: "Hongkong Branch Office",
      address:
        "AAL HK Trading Limited, address: 22/F 3 LOCKHART RD WANCHAI, HONG KONG",
    },
  ];

  return (
    <>
      <div className="relative h-full w-full flex-col bg-[#000000] lg:h-[26rem]">
        <div className="relative w-full flex flex-col gap-8 overflow-hidden bg-[#000000] py-4 px-8 lg:px-10 lg:py-8">
          <div className="flex h-full w-full flex-col items-center lg:items-start justify-between gap-10 lg:flex-row">
            <div className="flex justify-center items-center">
              <Image
                src={Assets.LogoEcho}
                alt="Logo Echo"
                style={{ width: "300px", height: "auto" }}
                loading="lazy"
              />
            </div>
            <div className="flex h-full w-full flex-col justify-between lg:w-[60%]">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-white">Location</h2>
                <div className="flex flex-col lg:flex-row gap-2 w-full">
                  {locations.map((location, index) => (
                    <div key={index} className="flex flex-col">
                      <h2 className="text-sm font-semibold text-white">
                        {location.title}
                      </h2>
                      <span className="text-sm text-white">
                        {location.address}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#D5BD9F] mt-10" />
          <div className="w-full flex flex-col lg:flex-row relative justify-between items-start">
            <div className="relative flex flex-col gap-4 lg:flex-row lg:gap-24">
              <div className="flex flex-row justify-between lg:gap-24">
                <div className="flex h-full flex-col">
                  <div className="flex flex-col gap-2">
                    <div className="">
                      <h2 className="text-lg font-bold text-white">Find Us</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          Email
                        </h2>
                      </div>
                      <Link href="mailto:aal@arsari.co.id">
                        <span className="text-sm text-white">
                          aal@arsari.co.id
                        </span>
                      </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          Phone
                        </h2>
                      </div>
                      <Link
                        target="_blank"
                        href={
                          "https://api.whatsapp.com/send/?phone=6282137476157&text=(Website)%20Halo+saya+ingin+bertanya+tentang+produk%20Echo%20Nusantara&type=phone_number&app_absent=0"
                        }
                      >
                        <span className="text-sm text-white">
                          +62 821 3747 6157
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex h-full flex-col">
                  <div className="flex h-full w-full flex-col gap-20">
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-2">
                        <div className="">
                          <h2 className="text-lg font-bold text-white">
                            ECHO Care
                          </h2>
                        </div>
                        <div className="flex w-full flex-col">
                          <Link href="/faq">
                            <span className="text-sm text-white transition-all duration-300 ease-in-out ">
                              FAQ
                            </span>
                          </Link>
                          {/* <Link href="/"> */}
                          <span className="text-sm text-white transition-all duration-300 ease-in-out ">
                            Privacy Policy
                          </span>
                          {/* </Link> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between lg:gap-24">
                <div className="flex flex-col items-start  lg:items-center gap-4">
                  <h2 className="text-lg font-bold text-white">E-Commerce</h2>
                  {socialMediaLinks.filter(
                    (link) =>
                      ["Tiktok", "Instagram"].includes(link.name) &&
                      link.isActive
                  ).length > 0 && (
                    <div className="flex flex-row gap-2">
                      {socialMediaLinks
                        .filter(
                          (link) =>
                            ["Tiktok", "Instagram"].includes(link.name) &&
                            link.isActive
                        )
                        .map((link) => (
                          <a
                            key={link.link}
                            target="_blank"
                            href={link.link}
                            className="flex flex-row gap-4"
                          >
                            <div className="h-[40px] w-[40px]">
                              <Image
                                src={link.image || Assets.X}
                                width={50}
                                height={50}
                                alt={link.name}
                                loading="lazy"
                              />
                            </div>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start lg:items-center gap-4">
                  <h2 className="text-lg font-bold text-white">Follow Us</h2>
                  {socialMediaLinks.filter(
                    (link) =>
                      ["Tiktok", "Instagram"].includes(link.name) &&
                      link.isActive
                  ).length > 0 && (
                    <div className="flex flex-row gap-2">
                      {socialMediaLinks
                        .filter(
                          (link) =>
                            ["Tiktok", "Instagram"].includes(link.name) &&
                            link.isActive
                        )
                        .map((link) => (
                          <a
                            key={link.link}
                            target="_blank"
                            href={link.link}
                            className="flex flex-row gap-4"
                          >
                            <div className="h-[40px] w-[40px] bg-[#B69B7C] rounded-full flex items-center justify-center">
                              <Image
                                src={link.image || Assets.X}
                                width={24}
                                height={24}
                                alt={link.name}
                                loading="lazy"
                              />
                            </div>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="text-lg font-bold text-white">Certificate</h2>
              </div>
              <div className="flex flex-row items-center justify-center gap-4">
                <a
                  href="/BPOM_EchoNusantara.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={Assets.BPOM}
                    alt={"BPOM"}
                    width={80}
                    height={80}
                    loading="lazy"
                    title="Logo BPOM"
                  />
                </a>
                <a
                  href="/HalalCertified_EchoNusantara.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={Assets.Halal}
                    alt={"Halal"}
                    width={80}
                    height={80}
                    loading="lazy"
                    title="Logo HALAL"
                  />
                </a>
                <Image
                  src={Assets.NKV}
                  alt={"NKV"}
                  width={80}
                  height={80}
                  loading="lazy"
                  title="Logo NKV"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[20] w-full flex-col items-center justify-center bg-[#D5BD9F] px-10 py-4 lg:flex-row">
          <span className="text-center font-domaine text-sm text-black lg:text-left">
            Copyright © 2025 Alam Anugrah Lestari Co., Ltd. All Rights
            Reserved.
          </span>
        </div>
      </div>
    </>
  );
};
