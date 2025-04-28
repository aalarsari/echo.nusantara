"use client";

import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarSection,
} from "@/components/molecules/Sidebar";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  SidebarItemMobile,
  SidebarMobile,
  SidebarSectionMobile,
} from "@/components/molecules/SidebarMobile";
import { Assets } from "@/assets";
import { useRouter } from "next/navigation";
import { $Enums } from "@prisma/client";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  var router = useRouter();
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsLoggedIn(false);
    router.replace("/");
  };

  return (
    <section className="relative flex h-screen w-full overflow-hidden">
      <Sidebar>
        <SidebarSection title="Main Menu">
          <SidebarItem
            icon={Assets.IconDashboard}
            text="Dashboard"
            href="/dashboard"
          />
          <SidebarItem
            icon={Assets.IconUsers}
            text="User"
            href="/dashboard/user"
          />
          <SidebarItem
            icon={Assets.IconProducts}
            text="Products"
            href="/dashboard/product"
          />
          {/* <SidebarItem
            icon={Assets.IconNewsblog}
            text="News"
            href="/dashboard/news"
          /> */}
          <SidebarItem
            icon={Assets.IconUsers}
            text="News"
            href=""
            dropdownItems={[
              {
                text: "Data",
                href: "/dashboard/news",
              },
              { text: "Category", href: "/dashboard/news/category" },
            ]}
          />
          {(role === $Enums.Role.SALES || role === $Enums.Role.ADMIN) && (
            <SidebarItem
              icon={Assets.IconUsers}
              text="General"
              href=""
              dropdownItems={[
                {
                  text: "Banner",
                  href: "/dashboard/content",
                },
                { text: "Category", href: "/dashboard/category" },
                { text: "Social Media", href: "/dashboard/social-media" },
                { text: "Review", href: "/dashboard/review" },
                { text: "Contact", href: "/dashboard/contact" },
                { text: "Subscriber", href: "/dashboard/subscriber" },
              ]}
            />
          )}
        </SidebarSection>
        <SidebarSection title="Transactions">
          <SidebarItem
            icon={Assets.IconTransaction}
            text="Payments"
            href="/dashboard/payments"
          />
          <SidebarItem
            icon={Assets.IconOrders}
            text="Orders"
            href="/dashboard/orders"
          />
        </SidebarSection>
      </Sidebar>
      <div className="relative h-full w-full bg-white">
        <div className="flex h-[3.5rem] w-full items-center justify-between  border-b bg-white pr-2">
          <div className="relative flex w-full items-end justify-end">
            <div
              className="flex cursor-pointer flex-row items-center justify-center gap-3"
              onClick={toggleDropdown}
            >
              <div className="h-10 w-10 rounded-full bg-[#CDB698]/50" />
              <h2 className="text-[12px] text-[#B69B78]">Administrasi</h2>
              <ChevronRightIcon className="h-4 w-4 cursor-pointer text-[#B69B78]" />
            </div>
            {showDropdown && (
              <div className="absolute right-2 top-10 z-[10] mt-4 w-52 rounded-md bg-white p-1 ring-1 ring-gray-100">
                <button
                  className="block w-full px-4 py-2 text-left text-[12px] text-gray-700 hover:bg-gray-100"
                  // onClick={handleProfile}
                >
                  Profile
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-[12px] text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="relative flex h-full w-full p-4">
          <div className="flex h-[88vh] w-full items-start justify-center bg-white">
            {children}
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`z-1 fixed inset-0 bg-black bg-opacity-25 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`fixed inset-y-0 left-0 w-64 transform bg-white p-4 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="relative w-full">
            <SidebarMobile>
              <SidebarSectionMobile title="Main Menu">
                <SidebarItemMobile
                  icon={Assets.IconDashboard}
                  text="Dashboard"
                  href="/dashboard"
                />
                <SidebarItemMobile
                  icon={Assets.IconUsers}
                  text="User"
                  href="/dashboard/user"
                />
                <SidebarItemMobile
                  icon={Assets.IconProducts}
                  text="Products"
                  href="/dashboard/product"
                />
              </SidebarSectionMobile>
              <SidebarSectionMobile title="Transactions">
                <SidebarItemMobile
                  icon={Assets.IconOrders}
                  text="Orders"
                  href="/dashboard/orders"
                />
                <SidebarItemMobile
                  icon={Assets.IconTransaction}
                  text="Payments"
                  href="/dashboard/transactions"
                />
              </SidebarSectionMobile>
              <SidebarSectionMobile title="General">
                <SidebarItemMobile
                  icon={Assets.IconDashboard}
                  text="Content"
                  href="/dashboard/content"
                />
                <SidebarItemMobile
                  icon={Assets.IconCategory}
                  text="Category"
                  href="/dashboard/category"
                />
                <SidebarItemMobile
                  icon={Assets.IconMedsos}
                  text="Social Media"
                  href="/dashboard/social-media"
                />
              </SidebarSectionMobile>
            </SidebarMobile>
          </div>
        </div>
      </div>
    </section>
  );
}
