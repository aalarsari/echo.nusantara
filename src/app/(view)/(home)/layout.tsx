"use client";

import { Footer, Navbar } from "@/components/organisms";
import { Subscribe } from "@/components/organisms/Home/Subscribe";
import { usePathname } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Subscribe />
      <Footer />
    </>
  );
}
