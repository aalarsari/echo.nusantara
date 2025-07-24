import React from "react";
import type { ReactNode } from "react";

interface CustomDotProps {
  onClick?: () => void;
  active?: boolean;
  index?: number;
}

export const CustomDot: React.FC<CustomDotProps> = ({ onClick, active }) => {
  return (
    <li
      className={`w-3 h-3 rounded-full mx-1 cursor-pointer ${
        active ? "bg-white" : "bg-gray-400"
      }`}
      onClick={onClick}
    />
  );
};
