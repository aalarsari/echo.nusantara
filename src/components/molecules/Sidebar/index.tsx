"use client";

import React, {
  FC,
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { FaQuestion } from "react-icons/fa";
import { Assets } from "@/assets";

interface SidebarProps {
  children: ReactNode;
}

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
});

export const Sidebar: FC<SidebarProps> = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname === "/dashboard";

  return (
    <aside className="h-screen">
      <div className="absolute lg:hidden">
        {!mobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="relative left-2 top-2 z-[99] p-2 text-black"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}
      </div>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`z-1 fixed inset-0 bg-black bg-opacity-25 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`fixed inset-y-0 left-0 w-64 transform bg-white p-4 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between pb-4">
            <Image
              src={Assets.LogoEchoBlack}
              alt="Logo Echo"
              width={150}
              height={150}
              loading="lazy"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-black"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <SidebarContext.Provider value={{ expanded }}>
            <ul
              className="flex-1 overflow-y-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              {children}
            </ul>
          </SidebarContext.Provider>
        </div>
      </div>
      <div className="hidden lg:block">
        <div
          className={`transition-width flex h-screen transform flex-col border-r bg-[#B69B7C17]/[9%] ${
            expanded ? "w-[18rem]" : "w-[4.5rem]"
          }`}
          style={{
            transition: "width 0.3s ease",
          }}
        >
          <div className="flex items-center justify-between p-5 pb-2">
            {expanded ? (
              <Image
                src={Assets.LogoEchoBlack}
                alt="Logo Echo"
                width={150}
                height={150}
                loading="lazy"
              />
            ) : (
              <Image
                width={40}
                height={40}
                src={Assets.LogoEchoBlack}
                alt="Logo Echo"
                className="hidden"
                loading="lazy"
              />
            )}
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="flex items-center justify-center rounded-lg p-2 hover:bg-gray-50"
            >
              {expanded ? (
                <Bars3Icon className="h-5 w-5 text-black" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 text-black" />
              )}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="mt-[2rem] h-full flex-1 overflow-y-auto px-3">
              {children}
            </ul>
          </SidebarContext.Provider>
        </div>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  icon: string;
  text: string;
  href: string;
  dropdownItems?: { text: string; href: string }[];
}

export const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  text,
  href,
  dropdownItems,
}) => {
  const pathname = usePathname();
  const { expanded } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = (href: string) => {
    if (dropdownItems && expanded) {
      setIsOpen(!isOpen); // Toggle dropdown visibility
    } else {
      router.push(href);
    }
  };

  const isActive = (href: string) => pathname === href;

  const isDropdownItemActive = dropdownItems?.some((item) =>
    isActive(item.href),
  );

  useEffect(() => {
    if (isDropdownItemActive && expanded) {
      setIsOpen(true);
    }
  }, [isDropdownItemActive, expanded]);

  return (
    <li
      className={`
          group relative flex cursor-pointer flex-col
          rounded-md
          font-medium transition-colors`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleClick(href)}
    >
      <div
        className={`flex items-center rounded-[4px] px-3 py-2 ${isActive(href) ? "bg-[#B69B7C]/[12%] text-[#B69B78]" : "text-[#B69B78]/[50%] hover:bg-[#B69B7C]/[12%]"}`}
      >
        <Image src={icon} alt={text} width={20} height={20} />
        <span
          className={`overflow-hidden text-[18px] font-medium transition-all  ${expanded ? "ml-3 w-52 " : "w-0"}`}
        >
          {text}
        </span>
        {dropdownItems && expanded && (
          <button onClick={() => setIsOpen(!isOpen)} className="relative">
            <ChevronDownIcon
              className={`ml-2 h-4 w-4 transform text-[#B69B78]/[50%] transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        )}
      </div>
      {dropdownItems && expanded && isOpen && (
        <ul className="my-1 ml-[32px] flex flex-col">
          {dropdownItems.map((item) => (
            <li
              key={item.href}
              className={`rounded-[4px] px-3 py-2 ${isActive(item.href) ? "bg-[#B69B7C]/[12%] text-[#B69B78]" : "text-[#B69B78]/[80%] hover:bg-[#B69B7C]/[12%]"}`}
            >
              <a
                href={item.href}
                className="block text-[18px] text-[#B69B78]/[80%] outline-none hover:text-[#B69B78] hover:no-underline"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export const SidebarSection: FC<SidebarSectionProps> = ({
  title,
  children,
}) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <div className="mb-4">
      <div className={`px-2 ${expanded ? "block" : "hidden"}`}>
        <h2 className="text-[16px] text-[#252525]">{title}</h2>
      </div>
      <ul>{children}</ul>
    </div>
  );
};
