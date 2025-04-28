import React from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

interface InputPasswordProps {
  label?: string;
  showPassword: boolean;
  togglePassword: () => void;
  register: any;
  name: string;
  placeholder: string;
  error?: string;
  width?: string;
  height?: string;
  color?: string;
}

export const InputPassword: React.FC<InputPasswordProps> = ({
  label,
  showPassword,
  togglePassword,
  register,
  name,
  placeholder,
  error,
  width,
  height,
  color,
}) => {
  return (
    <div className="relative flex w-full flex-col gap-2">
      <label className="font-josefins text-[16px] text-[#ADADAD]">
        {label}
      </label>
      <div
        className={`relative rounded-md text-white outline-none ${width} ${height}`}
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(name, {
            required: `${placeholder} is required`,
          })}
          // style={placeholderStyle}
          className="w-full appearance-none rounded-md border-[1px] border-gray-300 bg-white/[1%] px-4 py-2.5 font-josefins text-[18px] font-semibold text-gray-300 outline-none focus:border-[1px] focus:border-[#CDB698]"
        />
        <div
          className="absolute inset-y-0 right-4 flex cursor-pointer items-center"
          onClick={togglePassword}
        >
          {showPassword ? (
            <HiOutlineEyeOff className="h-5 w-5 text-white" />
          ) : (
            <HiOutlineEye className="h-5 w-5 text-white" />
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
