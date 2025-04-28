"use client";

import React, { useEffect, useState, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { GoogleTranslate } from "@/components/atoms/ButtonTranslate";
import { getPrefLangCookie } from "@/components/atoms/Translate/translate";
import { MobileMenuButton } from "@/components/atoms/MobileMenuButton";
import { LogoEcho } from "@/components/atoms/LogoEcho";
import { NavLinks } from "@/components/atoms/NavLinks";
import { ButtonNavLink, FormatRupiah } from "@/components/atoms";
import { SearchInput } from "@/components/atoms/SearchInput";
import { UserMenu } from "@/components/atoms/UserMenu";
import Link from "next/link";
import { ModalForceClose } from "@/components/molecules";
import { Assets } from "@/assets";
import Image from "next/image";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MobileMenu } from "@/components/atoms/MobileMenu";
import { fetchCount } from "@/lib/redux/pinCount";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  Deletecart,
  GetListCartNavbar,
  UpdateQuantity,
} from "@/controller/user/cart";
import {
  DeleteCartLocaly,
  GetProductLocaly,
  UpdateBuyQuantity,
} from "@/lib/cookies/cart";
import { useDebouncedCallback } from "use-debounce";
import { GetStock } from "@/controller/noAuth/stock";
import { WishlistItem } from "@/types/wishlist/wishlist";
import { GetListWishlist } from "@/controller/user/wishlist";
import { GetWishlistCookies } from "@/lib/cookies/wishlist";

export const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartHome, setCartHome] = useState<CartItem | null>(null);
  const prefLangCookie = getPrefLangCookie();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [previousCartState, setPreviousCartState] = useState<CartItem | null>(
    null,
  );
  const [stock, setStock] = useState<number | undefined>(undefined);
  const [quantity, SetQuantity] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);
  const [wishlistHome, setWishlistHome] = useState<WishlistItem[] | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isWishlistAnimating, setIsWishlistAnimating] =
    useState<boolean>(false);
  const searchInputRef = useRef<HTMLDivElement | null>(null);
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });
  const showNotification = (
    message: string,
    type: "success" | "error",
    duration: number = 3000,
  ) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, duration);
  };

  useEffect(() => {
    setIsLoggedIn(!!session);
  }, [session]);

  useEffect(() => {
    if (pathname !== "/checkout" && previousCartState) {
      setCartHome(previousCartState);
    }
  }, [pathname, previousCartState]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(window.location.search);
    if (term) params.set("query", term);
    else params.delete("query");
    router.push(`/shop?${params.toString()}`);
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleCheckout = () => {
    handleCartClose();
    router.push("/checkout");
  };

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
    localStorage.clear();
    document.cookie = "";
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const onAnimationEnd = () => {
      setIsCartAnimating(false);
    };

    const cartDiv = document.querySelector(".cart-div");

    if (cartDiv) {
      cartDiv.addEventListener("animationend", onAnimationEnd);
      return () => {
        cartDiv.removeEventListener("animationend", onAnimationEnd);
      };
    }
  }, [isCartAnimating]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setIsSearchOpen(false);
    }
  };

  const dispatch: AppDispatch = useDispatch();

  const handleCartIconClick = async () => {
    setIsCartAnimating(true);
    setIsCartOpen(!isCartOpen);
    document.body.style.overflow = isCartOpen ? "auto" : "hidden";

    try {
      if (isLoggedIn === true) {
        const res = await GetListCartNavbar();
        var body = await res.json();
        setCartHome(body.data);
      } else {
        const data = await GetProductLocaly();
        setCartHome(data);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  var cartCount: number = useSelector((state: RootState) => state.pin.cart!);
  var wishlistCount: number = useSelector(
    (state: RootState) => state.pin.wishlist!,
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleWishlistIconClick = async () => {
    setIsWishlistAnimating(true);
    setIsWishlistOpen(!isWishlistOpen);
    document.body.style.overflow = isWishlistOpen ? "auto" : "hidden";

    try {
      if (isLoggedIn === true) {
        const res = await GetListWishlist();
        const body = await res.json();
        setWishlistHome(body.data);
      } else {
        var data = await GetWishlistCookies();
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  };

  const IconLinks = [
    {
      src: Assets.IconSearch,
      alt: "Icon Search",
      onClick: toggleSearch,
    },
    {
      src: Assets.IconLove,
      alt: "Icon Love",
      onClick: handleWishlistIconClick,
    },
    {
      src: Assets.IconCart,
      alt: "Icon Cart",
      onClick: handleCartIconClick,
    },
  ];

  const handleDecreaseQuantity = async (
    cartId: number | undefined,
    productId: number | undefined,
  ) => {
    if (!cartId || !productId) return;

    const updatedCart = cartHome?.cart?.map((item) => {
      if (item.id === cartId) {
        const newQuantity = Math.max(0, item.buyQuantity! - 1);
        if (newQuantity === 0) {
          handleDeleteCartItem(cartId, productId);
          return item;
        }

        if (isLoggedIn) {
          UpdateQuantity({ quantity: newQuantity }, cartId);
        } else {
          UpdateBuyQuantity(productId!, newQuantity);
        }
        return { ...item, buyQuantity: newQuantity };
      }
      return item;
    });

    const newTotal = updatedCart?.reduce((acc, curr) => {
      return acc + (curr.product?.priceIDR || 0) * (curr.buyQuantity || 0);
    }, 0);

    setCartHome((prevCartHome) => ({
      ...prevCartHome!,
      cart: updatedCart || [],
      total: newTotal || 0,
    }));
  };

  const handleIncreaseQuantity = async (
    cartId: number | undefined,
    productId: number | undefined,
  ) => {
    if (!cartId || !productId) return;

    const updatedCart = cartHome?.cart?.map((item) => {
      if (item.id === cartId) {
        const newQuantity = item.buyQuantity! + 1;
        if (isLoggedIn) {
          UpdateQuantity({ quantity: newQuantity }, cartId);
        } else {
          UpdateBuyQuantity(productId!, newQuantity);
        }
        const newPrice = (item.product?.price || 0) * newQuantity;
        return { ...item, buyQuantity: newQuantity, price: newPrice };
      }
      return item;
    });

    const newTotal = updatedCart?.reduce((acc, curr) => {
      return acc + (curr.product?.priceIDR || 0) * (curr.buyQuantity || 0);
    }, 0);

    setCartHome((prevCartHome) => ({
      ...prevCartHome!,
      cart: updatedCart || [],
      total: newTotal || 0,
    }));
  };

  const handleQuantityChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    cartId: number | undefined,
    productId: number | undefined,
  ) => {
    const newValue = parseInt(e.target.value);

    if (cartId !== undefined || productId !== undefined) {
      if (!isNaN(newValue) && newValue >= 0) {
        const updatedCart = cartHome?.cart?.map((item) => {
          if (item.id === cartId) {
            const newQuantity = newValue;
            if (isLoggedIn) {
              UpdateQuantity({ quantity: newQuantity }, cartId!);
            } else {
              UpdateBuyQuantity(productId!, newQuantity);
            }
            return { ...item, buyQuantity: newQuantity };
          }
          return item;
        });

        const newTotal = updatedCart?.reduce((acc, curr) => {
          return acc + (curr.product?.priceIDR || 0) * (curr.buyQuantity || 0);
        }, 0);

        setCartHome((prevCartHome) => ({
          ...prevCartHome!,
          cart: updatedCart || [],
          total: newTotal || 0,
        }));
      } else if (newValue === 0 || e.target.value === "") {
        await handleDeleteCartItem(cartId, productId);
      }
    }
  };

  const handleDeleteCartItem = async (
    cartId: number | undefined,
    productId: number | undefined,
  ) => {
    if (!cartId || !productId) return;

    try {
      if (isLoggedIn) {
        await Deletecart({ id: cartId });
      } else {
        DeleteCartLocaly(productId);
      }

      const updatedCart = (cartHome?.cart || []).filter(
        (item) => item.id !== cartId,
      );

      const newTotal = updatedCart?.reduce((acc, curr) => {
        return acc + (curr.product?.price || 0) * (curr.buyQuantity || 0);
      }, 0);

      const newCount = updatedCart?.length || 0;

      setCartHome((prevCartHome) => ({
        ...prevCartHome!,
        cart: updatedCart || [],
        total: newTotal || 0,
        count: newCount,
      }));
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  useEffect(() => {
    try {
      dispatch(fetchCount());
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (pathname !== "/checkout" && previousCartState) {
      setCartHome(previousCartState);
    }
  }, [pathname, previousCartState]);

  const handleCartClose = () => {
    setIsCartAnimating(true);
    setIsCartOpen(false);
    document.body.style.overflow = "auto";
  };
  const handleWishlistClose = () => {
    setIsWishlistAnimating(true);
    setIsWishlistOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <ModalForceClose session={session} />
      <div className="fixed top-0 z-[99] w-full" style={{ transition: "0.5s" }}>
        <div className="block w-full">
          <div className="relative">
            <div
              className={
                navbar
                  ? "navbar active"
                  : "navbar absolute z-[10] w-full bg-white backdrop-blur-sm"
              }
            >
              <nav className="mx-auto flex h-[4rem] items-center justify-between px-4 md:py-4 xl:px-[4rem]">
                <div className="flex w-[25%] flex-row items-center justify-start gap-4">
                  <MobileMenuButton
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  />
                  <LogoEcho />
                  <GoogleTranslate prefLangCookie={prefLangCookie} />
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
                    {IconLinks.map((icon, index) => (
                      <div
                        key={index}
                        className="relative transition-all duration-300 hover:scale-110"
                      >
                        {icon.alt === "Icon Search" && isSearchOpen && (
                          <div
                            ref={searchInputRef}
                            className="absolute right-0 top-full mt-2 w-[15rem]"
                          >
                            <input
                              type="text"
                              placeholder="Search..."
                              onChange={(e) => handleSearch(e.target.value)}
                              className="w-full rounded-md border border-[#C1AE94] px-3 py-2 text-sm outline-none focus:border-[#C1AE94] focus:outline-none"
                            />
                          </div>
                        )}
                        <Image
                          src={icon.src}
                          alt={icon.alt}
                          style={{ width: "auto", height: "auto" }}
                          className="cursor-pointer"
                          onClick={icon.onClick}
                        />
                        {icon.alt === "Icon Cart" && cartCount > 0 && (
                          <span className="absolute -right-2 -top-2 flex h-[1.05rem] w-[1.05rem] items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white ring-1 ring-white">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    ))}
                    {isLoggedIn ? (
                      <UserMenu
                        onProfileClick={handleProfile}
                        onLogout={handleLogout}
                      />
                    ) : (
                      <Link href={"/login"} className="h-[34px] w-[97px]">
                        <button className="font-cardo h-full w-full rounded-[4px] border-[1px] border-[#C1AE94] text-[16px] text-[#C1AE94] transition-all duration-300 hover:bg-[#C1AE94] hover:text-white">
                          Login
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </nav>
            </div>
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>
      {isCartOpen && (
        <div className="fixed left-0 top-0 z-[100] h-screen w-screen bg-black/30 backdrop-blur-sm transition-opacity duration-500 ease-in-out">
          <div
            className={`${isCartAnimating ? "cart-div-enter" : ""} ${isCartOpen ? "right-0 w-full md:w-[450px]" : "-right-20 w-0"} absolute top-0 z-[999] h-[100%] bg-white p-4 transition delay-150 duration-300 ease-in-out`}
          >
            <div className="relative h-full w-full flex-col bg-white">
              <div className="flex h-[3.5rem] w-full items-center justify-between border-b-[1px] border-[#C1AE94] px-1">
                <h2 className="font text-[22px] text-[#7D716A]">Your Items</h2>
                <div className="flex flex-row gap-2">
                  <span className="text-[16px] font-semibold text-[#BFBEBE]">
                    {cartHome?.count} Items
                  </span>
                  <XMarkIcon
                    onClick={handleCartClose}
                    className="h-6 w-6 cursor-pointer text-[#231F20]"
                  />
                </div>
              </div>
              <div className="relative h-[70vh] w-full gap-2 overflow-y-scroll p-2">
                {cartHome?.cart?.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-row items-center justify-between border-b-[0.5px] border-[#7D716A] px-2 py-2"
                  >
                    <div className="flex h-full w-full flex-row items-start justify-between">
                      <div className="flex h-full w-full flex-row items-start gap-2">
                        <div className="relative h-[100px] w-[100px] rounded-sm bg-gray-50">
                          <Image
                            src={item.product?.image1 || Assets.DefaultProduct}
                            alt={item?.product?.name!}
                            style={{ objectFit: "cover" }}
                            fill
                          />
                        </div>
                        <div className="relative flex h-[100px] w-[70%] flex-col justify-between">
                          <span className="text-[14px] font-semibold text-[#231F20]">
                            {item.product?.name}
                          </span>
                          <div className="flex flex-row gap-4">
                            {/* Quantity adjustment buttons */}
                            <div className="flex h-[1.75rem] w-[6rem] rounded-sm border-[0.5px] border-[#7D716A]">
                              <button
                                onClick={() =>
                                  handleDecreaseQuantity(
                                    item.id,
                                    item.product!.id!,
                                  )
                                }
                                disabled={item.buyQuantity! <= 0}
                                className="h-full w-[30%] cursor-pointer"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.buyQuantity || 0}
                                className="h-full w-full appearance-none px-[14px] text-center outline-none"
                                onChange={(e) =>
                                  handleQuantityChange(
                                    e,
                                    item.id,
                                    item.product?.id,
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  handleIncreaseQuantity(
                                    item.id,
                                    item.product!.id,
                                  )
                                }
                                className="h-full w-[30%] cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            {/* Remove item button */}
                            <button
                              onClick={() =>
                                handleDeleteCartItem(item.id, item.product?.id)
                              }
                              className="flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-sm border-[0.5px] border-[#7D716A]"
                            >
                              <TrashIcon className="h-5 w-5 text-[#7D716A]" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Show discount price */}
                      <div className="flex w-[45%] items-end justify-end">
                        {item.product?.Discount?.length > 0 &&
                        item.product?.Discount[0]?.discount ? (
                          <div className="flex flex-col items-end">
                            <span className="text-gray-500 line-through">
                              <FormatRupiah
                                price={item.product?.priceIDR || 0}
                              />
                            </span>
                            <FormatRupiah
                              price={
                                (item.product?.priceIDR || 0) -
                                (item.product?.priceIDR || 0) *
                                  (item.product.Discount[0]?.discount || 0)
                              }
                            />
                            <span className="text-red-500">
                              {`${(
                                item.product.Discount[0]?.discount * 100
                              ).toFixed(0)}% Off`}
                            </span>
                          </div>
                        ) : (
                          <FormatRupiah price={item.product?.priceIDR || 0} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Total Price Section */}
              <div className="absolute bottom-2 flex h-[7rem] w-full flex-col justify-between">
                <div className="flex h-[3.25rem] w-full flex-row items-center justify-between border-t-[0.5px] border-[#7D716A] px-1">
                  <h2 className="font-josefins text-[16px] text-[#92734E]">
                    Subtotal
                  </h2>
                  <span className="font-josefins text-[16px] text-[#231F20]">
                    <FormatRupiah
                      price={
                        cartHome?.cart?.reduce((total, item) => {
                          const discount =
                            item.product?.Discount?.[0]?.discount || 0;
                          const price = item.product?.priceIDR || 0;
                          const discountedPrice = price - price * discount;
                          return (
                            total + discountedPrice * (item.buyQuantity || 0)
                          );
                        }, 0) || 0
                      }
                    />
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={
                    !cartHome?.cart?.length ||
                    cartHome?.cart?.reduce((total, item) => {
                      const discount =
                        item.product?.Discount?.[0]?.discount || 0;
                      const price = item.product?.priceIDR || 0;
                      const discountedPrice = price - price * discount;
                      return total + discountedPrice * (item.buyQuantity || 0);
                    }, 0) === 0
                  }
                  className={`h-[48px] w-full transform rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] transition-all duration-300 ease-in-out ${
                    !cartHome?.cart?.length ||
                    cartHome?.cart?.reduce((total, item) => {
                      const discount =
                        item.product?.Discount?.[0]?.discount || 0;
                      const price = item.product?.priceIDR || 0;
                      const discountedPrice = price - price * discount;
                      return total + discountedPrice * (item.buyQuantity || 0);
                    }, 0) === 0
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82]"
                  }`}
                >
                  <span className="flex h-full w-full items-center justify-center uppercase text-white">
                    Checkout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isWishlistOpen && (
        <div className="fixed left-0 top-0 z-[100] h-screen w-screen bg-black/30 backdrop-blur-sm transition-opacity duration-500 ease-in-out">
          <div
            className={`${isWishlistAnimating ? "cart-div-enter" : ""} ${isWishlistOpen ? "right-0 w-full md:w-[450px]" : "-right-20 w-0"} absolute top-0 z-[999] h-[100%] bg-white p-4 transition delay-150 duration-300 ease-in-out`}
          >
            <div className="relative h-full w-full flex-col bg-white">
              <div className="flex h-[3.5rem] w-full items-center justify-between border-b-[1px] border-[#C1AE94] px-1">
                <div>
                  <h2 className="font text-[22px] text-[#7D716A]">
                    Your Wishlists
                  </h2>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="text-[16px] font-semibold text-[#BFBEBE]">
                    {wishlistHome?.length} Items
                  </span>
                  <XMarkIcon
                    onClick={handleWishlistClose}
                    className="h-6 w-6 cursor-pointer text-[#231F20]"
                  />
                </div>
              </div>
              <div className="relative h-[80vh] w-full gap-2 overflow-y-scroll p-2">
                <div className="flex flex-col gap-2">
                  {wishlistHome &&
                    wishlistHome.map((wishlistItem, index: number) => (
                      <div key={index}>
                        {wishlistItem.product && (
                          <div className="flex h-[5.5rem] flex-row gap-2">
                            <div className="relative h-full w-[6.5rem]">
                              <Image
                                src={wishlistItem.product.image1!}
                                alt={wishlistItem.product.name!}
                                fill
                                sizes="( max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={true}
                              />
                            </div>
                            <div className="h-full flex-col gap-2">
                              <div>
                                <h2 className="text-lg font-semibold">
                                  {wishlistItem.product.name}
                                </h2>
                              </div>
                              <FormatRupiah
                                price={wishlistItem.product.priceIDR! || 0}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              <div className="absolute -bottom-14 flex h-[7rem] w-full flex-col">
                <button
                  onClick={handleCheckout}
                  className="h-[48px] w-full transform rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82]"
                >
                  <span className="flex h-full w-full items-center justify-center uppercase text-white">
                    Checkout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
