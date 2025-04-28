export const NavLinks = [
  { path: "/", label: "Home" },
  { path: "/product", label: "Product" },
  { path: "/shop", label: "Shop" },
  { path: "/news", label: "News" },
  { path: "/contact", label: "Contact" },
];

export const NavbarIcons = ({
  isCartOpen,
  isWishlistOpen,
  setIsCartOpen,
  setIsWishlistOpen,
  fetchCartData,
  fetchWishlistData,
}: any) => (
  <>
    <button onClick={() => setIsCartOpen(!isCartOpen)}>Cart</button>
    <button onClick={() => setIsWishlistOpen(!isWishlistOpen)}>Wishlist</button>
  </>
);
