"use client";

import React from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { NavLinks } from "@/components/atoms/NavLinks";
import { Assets } from "@/assets";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <Transition
      show={isOpen}
      enter="transition-transform transition-opacity duration-300"
      enterFrom="transform -translate-x-full opacity-0"
      enterTo="transform translate-x-0 opacity-100"
      leave="transition-transform transition-opacity duration-300"
      leaveFrom="transform translate-x-0 opacity-100"
      leaveTo="transform -translate-x-full opacity-0"
      className="fixed inset-0 z-20 bg-white p-4 lg:hidden"
    >
      <div className="flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <Image
            src={Assets.LogoEchoBlack}
            alt="Logo"
            width={135}
            height={43}
            priority
          />
          <XMarkIcon
            className="h-6 w-6 cursor-pointer text-[#252525]"
            onClick={onClose}
          />
        </div>
        <div className="flex flex-col gap-4">
          {NavLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`${
                pathname === link.path ? "text-[#343434]" : "text-[#ADADAD]"
              } border-b-[0.5px] border-[#ADADAD] py-4 text-center font-domaine text-[18px] font-light uppercase outline-none transition-all duration-300`}
              onClick={onClose}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Transition>
  );
};
