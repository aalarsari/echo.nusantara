"use client";

import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ButtonNavLink } from "@/components";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { Assets } from "@/assets";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { GoogleTranslate } from "@/components/atoms/ButtonTranslate";
import { getPrefLangCookie } from "@/components/atoms/Translate/translate";

export const NavHome = () => {
  const prefLangCookie = getPrefLangCookie();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const checkIsLoggedIn = () => {
      setIsLoggedIn(!!session);
    };

    checkIsLoggedIn();
  }, [session]);

  const handleProfile = () => {
    router.push("/profile");
  };
  const handleLogout = () => {
    signOut({ redirect: false });
    router.push("/");
    localStorage.clear();
    document.cookie = "";
    setIsLoggedIn(false);
  };
  const NavLinks = [
    {
      path: "/",
      label: "Home",
    },
    {
      path: "/product",
      label: "Product",
    },
    {
      path: "/shop",
      label: "Shop",
    },
    {
      path: "/news",
      label: "News",
    },

    {
      path: "/contact",
      label: "Contact",
    },
  ];

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY >= 10) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    };
    window.addEventListener("scroll", changeBackground);
  });

  return (
    <>
      <div
        className="fixed top-0 z-[99999] w-full"
        style={{ transition: "0.5s" }}
      >
        <div className="block w-full">
          <div className="relative">
            <div
              className={
                navbar
                  ? "navbar active"
                  : "navbar absolute z-[10] w-full bg-black/5 backdrop-blur-sm"
              }
            >
              <nav className="mx-auto flex h-[4rem] items-center justify-between px-4 md:py-4 xl:px-[4rem]">
                <div className="flex w-[25%] flex-row items-center justify-start gap-4">
                  <div className="block lg:hidden">
                    <Bars3Icon
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="h-6 w-6 text-[#252525]"
                    />
                  </div>
                  <div className="hidden lg:block">
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Link href={"/"} className="px-4">
                        <Image
                          src={Assets.LogoEchoBlack}
                          alt="Logo ECHO"
                          style={{ width: "auto", height: "auto" }}
                          loading="lazy"
                        />
                      </Link>
                      <GoogleTranslate prefLangCookie={prefLangCookie} />
                    </div>
                  </div>
                </div>
                <div className="flex w-[50%] justify-center">
                  <ul className="hidden items-center space-x-12 lg:flex">
                    {NavLinks.map((link, index) => (
                      <li
                        key={index}
                        className="flex h-full items-center justify-center"
                      >
                        <ButtonNavLink href={link.path}>
                          {link.label}
                        </ButtonNavLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative flex w-full justify-end md:w-[25%]">
                  <div className="flex flex-row items-center justify-center gap-4">
                    {isLoggedIn ? (
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="inline-flex w-full justify-center rounded-md py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                            <UserIcon className="h-6 w-6 text-[#C1AE94]" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as="div"
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="px-1 py-1 ">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={handleProfile}
                                    aria-label="Profile"
                                    className={`${active ? "bg-[#C1AE94] text-white" : "text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                  >
                                    Profile
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={handleLogout}
                                    aria-label="Logout"
                                    className={`${active ? "bg-[#C1AE94] text-white" : "text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                  >
                                    Logout
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <Link href={"/login"} className="h-[36px] w-[120px]">
                        <button
                          aria-label="Login"
                          className="h-full w-full rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] font-domaine text-[20px] text-white transition-all duration-300 hover:bg-[#C1AE94] hover:text-white"
                        >
                          Login
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </nav>
            </div>
            <Transition
              show={isMobileMenuOpen}
              enter="transition-transform duration-300"
              enterFrom="transform -translate-x-full"
              enterTo="transform translate-x-0"
              leave="transition-transform duration-300"
              leaveFrom="transform translate-x-0"
              leaveTo="transform -translate-x-full"
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
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  {NavLinks.map((link) => (
                    <a
                      key={link.path}
                      href={link.path}
                      className={`${
                        pathname === link.path
                          ? "text-[#343434]"
                          : "text-[#ADADAD]"
                      } border-b-[0.5px] border-[#ADADAD] py-4 text-center font-domaine text-[18px] font-light uppercase outline-none transition-all duration-300`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </>
  );
};
