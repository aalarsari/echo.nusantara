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
      title: "Surabaya Branch Office",
      address:
        "Surabaya Branch Office: JI. Ciliwung No. 1 Darmo, Wonokromo. Kota Surabaya. 60241 Indonesia",
    },
    {
      title: "Hongkong Branch Office",
      address:
        "AAL HK Trading Limited, address: 22/F 3 LOCKHART RD WANCHAI, HONG KONG",
    },
  ];

  return (
    <>
      <div className="relative h-full w-full flex-col bg-white lg:h-[26rem]">
        <div className="relative h-full w-full overflow-hidden bg-white lg:h-[24rem]">
          <div className="flex h-full w-full flex-col items-start justify-start gap-10 p-4 lg:flex-row lg:px-14 lg:py-10">
            <div className="relative flex h-full w-full flex-col lg:w-[50%]">
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:justify-start">
                <div className="flex items-center justify-center">
                  <Image
                    src={Assets.LogoEchoBlack}
                    alt="Logo Echo"
                    style={{ width: "500px", height: "auto" }}
                    loading="lazy"
                  />
                </div>
                <div className="flex w-full flex-row items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-4">
                    <h2 className="text-sm font-semibold text-black">
                      E-commerce
                    </h2>
                    {socialMediaLinks.filter(
                      (link) =>
                        ["Tokopedia", "Shopee", "Lazada"].includes(link.name) &&
                        link.isActive,
                    ).length > 0 && (
                      <div className="flex flex-row gap-2">
                        {socialMediaLinks
                          .filter(
                            (link) =>
                              ["Tokopedia", "Shopee", "Lazada"].includes(
                                link.name,
                              ) && link.isActive,
                          )
                          .map((link) => (
                            <a
                              key={link.link}
                              target="_blank"
                              href={link.link}
                              className="flex flex-row gap-4 outline-none"
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

                  <div className="flex flex-col items-center gap-4">
                    <h2 className="text-sm font-semibold text-black">
                      Social Media
                    </h2>
                    {socialMediaLinks.filter(
                      (link) =>
                        ["Tiktok", "Instagram"].includes(link.name) &&
                        link.isActive,
                    ).length > 0 && (
                      <div className="flex flex-row gap-2">
                        {socialMediaLinks
                          .filter(
                            (link) =>
                              ["Tiktok", "Instagram"].includes(link.name) &&
                              link.isActive,
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
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-col justify-between lg:w-[50%]">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-black">Location</h2>
                {locations.map((location, index) => (
                  <div key={index} className="flex w-full flex-col gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-black">
                        {location.title}
                      </h2>
                    </div>
                    <span className="text-sm text-[#252525]">
                      {location.address}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full flex-row">
              <div className="flex h-full w-full flex-col lg:w-[50%]">
                <div className="flex flex-col gap-2">
                  <div className="">
                    <h2 className="text-lg font-bold text-black">Find Us</h2>
                  </div>
                  <div className="flex w-[60%] flex-col gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-black">
                        Email
                      </h2>
                    </div>
                    <Link href="mailto:aal@arsari.co.id">
                      <span className="text-sm text-[#252525]">
                        aal@arsari.co.id
                      </span>
                    </Link>
                  </div>
                  <div className="flex w-[60%] flex-col gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-black">
                        Phone
                      </h2>
                    </div>
                    <Link
                      target="_blank"
                      href={
                        "https://api.whatsapp.com/send/?phone=6282137476157&text=(Website)%20Halo+saya+ingin+bertanya+tentang+produk%20Echo%20Nusantara&type=phone_number&app_absent=0"
                      }
                    >
                      <span className="text-sm text-[#252525]">
                        +62 821 3747 6157
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex h-full w-[50%] flex-col">
                <div className="flex h-full w-full flex-col gap-20">
                  <div className="flex w-full  flex-col lg:w-[50%]">
                    <div className="flex flex-col gap-2">
                      <div className="">
                        <h2 className="text-lg font-bold text-black">
                          ECHO Care
                        </h2>
                      </div>
                      <div className="flex w-full flex-col lg:w-[60%]">
                        <Link href="/faq">
                          <span className="text-sm text-[#252525] transition-all duration-300 ease-in-out hover:text-[#835a41]">
                            FAQ
                          </span>
                        </Link>
                        <Link href="/">
                          <span className="text-sm text-[#252525] transition-all duration-300 ease-in-out hover:text-[#000000]">
                            Privacy Policy
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="mt-2 flex flex-col gap-2">
                        <div>
                          <h2 className="text-sm font-semibold text-black">
                            Certificate
                          </h2>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-4">
                          <a
                            href="/BPOM_EchoNusantara.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={Assets.BpomBrown}
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
                              src={Assets.HalalWhite}
                              alt={"Halal"}
                              width={80}
                              height={80}
                              loading="lazy"
                              title="Logo HALAL"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[20] w-full flex-col items-center justify-between bg-[#85776E] px-10 py-4 lg:flex-row">
          <div>
            <Image
              src={Assets.LogoEcho}
              alt={"Logo"}
              width={100}
              height={100}
            />
          </div>
          <span className="text-center font-domaine text-sm text-white lg:text-left">
            Copyright © 2025 Alam Anugrah Lestari Co., Ltd. All Rights
            Reserved.
          </span>
        </div>
      </div>
    </>
  );
};
