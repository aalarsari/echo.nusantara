"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ButtonNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const ButtonNavLink: React.FC<ButtonNavLinkProps> = ({
  href,
  children,
  onClick,
}) => {
  const pathname = usePathname();
  const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    setShowBorder(pathname === href);
  }, [pathname, href]);

  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative inline-block appearance-none overflow-hidden font-domaine text-[18px] font-light uppercase text-[#221F20] no-underline transition-all duration-300 hover:text-[#C1AE94] hover:no-underline focus:text-[#C1AE94] focus:no-underline focus:outline-none focus-visible:outline-none ${
        pathname === href ? "text-[#C1AE94]" : ""
      }`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: showBorder ? "100%" : 0,
          height: "1.5px",
          backgroundColor: "#C1AE94",
          transition: "width 0.5s ease",
        }}
      ></span>
    </a>
  );
};
