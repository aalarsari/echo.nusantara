import React, { useState } from "react";

interface ButtonPrimaryProps {
  onClick?: () => void;
  width?: string;
  height: string;
  text: string;
  disabled?: boolean;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  onClick,
  width,
  height,
  text,
  disabled = false,
}) => {
  return (
    <div
      className={`transform cursor-pointer rounded-full bg-[#B69B7C]
      transition-all duration-300 ease-in-out ${
        !disabled ? "hover:bg-[#B69B7C]" : "cursor-not-allowed opacity-50"
      } ${width} ${height}`}
    >
      <button
        className="flex h-full w-full items-center justify-center font-domaine text-[20px] text-white rounded-full"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};
