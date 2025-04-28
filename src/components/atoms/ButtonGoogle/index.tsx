import React from "react";
import Image from "next/image";
import { Assets } from "@/assets";

interface ButtonGoogleProps {
  onClick?: () => void;
}

export const ButtonGoogle: React.FC<ButtonGoogleProps> = ({ onClick }) => {
  return (
    <div className="h-[55px] w-[350px] md:w-[426px]">
      <button
        type="submit"
        className="w-full rounded-md bg-[#BCBCBC]/25 px-4 py-3 text-white ring-1 ring-gray-50 transition-all duration-300 ease-in-out hover:bg-white/25"
        onClick={onClick}
      >
        <div className="flex items-center justify-center gap-2">
          <Image
            src={Assets.LogoGoogle}
            alt="Logo Google"
            width={20}
            height={20}
            style={{ width: "auto" }}
          />
          <p className="text-sm font-light">Sign in with Google</p>
        </div>
      </button>
    </div>
  );
};
