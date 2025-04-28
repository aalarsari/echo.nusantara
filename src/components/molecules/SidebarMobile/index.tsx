"use client";

import React, { FC, ReactNode, useState, createContext } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Assets } from "@/assets";

interface DashboardLayoutProps {
  children: ReactNode;
}

const SidebarContext = createContext({});

export const SidebarMobile: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`h-screen ${isOpen ? "block" : "hidden"}`}>
      <div className="block lg:hidden">
        <div
          className={`transition-width flex h-screen w-full transform flex-col `}
          style={{ transition: "width 0.3s ease" }}
        >
          <div className="flex items-center justify-between pb-2">
            {isOpen && (
              <Image
                width={100}
                height={100}
                src={Assets.LogoEchoBlack}
                alt="Logo Echo"
                className="block"
                loading="lazy"
              />
            )}
          </div>

          <SidebarContext.Provider value={{}}>
            <ul className="mt-[2rem] h-full flex-1 overflow-y-auto">
              {children}
            </ul>
          </SidebarContext.Provider>
        </div>
      </div>
    </aside>
  );
};

interface SidebarItemMobileProps {
  icon: string;
  text: string;
  href: string;
  alert?: boolean;
}

export const SidebarItemMobile: FC<SidebarItemMobileProps> = ({
  icon,
  text,
  href,
  alert,
}) => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const isActive = pathname === href;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <li
      className={`
          group relative my-1 flex cursor-pointer items-center gap-2
          rounded-md px-3 py-2
          font-medium transition-colors
          ${isActive ? "bg-[#ffffff] text-red-400" : "text-[#B69B78] hover:bg-[#ffffff]"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleClick(href)}
    >
      <Image src={icon} alt={text} width={20} height={20} />
      <span
        className={`overflow-hidden text-[18px] font-medium text-[#B69B78] transition-all`}
      >
        {text}
      </span>
      {alert && (
        <div className={`absolute right-2 h-2 w-2 rounded bg-indigo-400`} />
      )}
      {!isOpen && isHovered && (
        <div
          className={`
            absolute left-full z-10 ml-6 -translate-x-3
            rounded-md bg-indigo-100 px-2 py-1 text-sm text-indigo-800
            opacity-20 transition-all
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
};

interface SidebarSectionMobileProps {
  title: string;
  children: ReactNode;
}

export const SidebarSectionMobile: FC<SidebarSectionMobileProps> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-4">
      <div className={`block px-2`}>
        <h2 className="text-[16px] text-[#B69B78]">{title}</h2>
      </div>
      <ul>{children}</ul>
    </div>
  );
};
