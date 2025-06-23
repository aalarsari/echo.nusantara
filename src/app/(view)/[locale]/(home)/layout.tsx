import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Footer, Navbar } from "@/components";
import { Subscribe } from "@/components/organisms/Home/Subscribe";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export default async function HomeLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Subscribe />
      <Footer />
    </>
  );
}
