import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const CustomDot = ({
  onClick,
  active,
}: {
  onClick: any;
  active: boolean;
}) => {
  return (
    <button
      className={`mx-2 my-4 h-2 w-2 rounded-full focus:outline-none ${active ? "bg-[#C1AE94]" : "bg-white ring-[0.5px] ring-[#C1AE94]"}`}
      onClick={() => onClick()}
    />
  );
};

export const CustomArrowLeft = ({
  onClick,
  isHovered,
}: {
  onClick: any;
  isHovered: boolean;
}) => {
  return (
    <button
      className={`custom-arrow-button absolute left-4 top-1/2 z-[99] flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-[#C1AE94] text-white focus:outline-none ${isHovered ? "opacity-100" : "pointer-events-none opacity-0"} left`}
      onClick={() => onClick()}
    >
      <ChevronLeftIcon className="h-6 w-6 text-white" />
    </button>
  );
};

export const CustomArrowRight = ({
  onClick,
  isHovered,
}: {
  onClick: any;
  isHovered: boolean;
}) => {
  return (
    <button
      className={`custom-arrow-button absolute right-4 top-1/2 z-[99] flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-[#C1AE94] text-white focus:outline-none ${isHovered ? "opacity-100" : "pointer-events-none opacity-0"} right`}
      onClick={() => onClick()}
    >
      <ChevronRightIcon className="h-6 w-6 text-white" />
    </button>
  );
};
