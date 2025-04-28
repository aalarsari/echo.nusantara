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
      className={`transform rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] 
      transition-all duration-300 ease-in-out ${
        !disabled
          ? "hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82]"
          : "cursor-not-allowed opacity-50"
      } ${width} ${height}`}
    >
      <button
        className="flex h-full w-full items-center justify-center font-domaine text-[20px] text-white"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};
