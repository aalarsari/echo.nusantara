import Link from "next/link";
import Image from "next/image";
import { Assets } from "@/assets";

export const LogoEcho: React.FC = () => (
  <div className="hidden lg:block">
    <Link href={"/"} className="h-20 w-20 px-4">
      <Image src={Assets.LogoEchoBlack} alt="Logo ECHO" loading="lazy" />
    </Link>
  </div>
);
