"use client";

import { FormatRupiah, Notifications } from "@/components/atoms";
import { GetListWishlist } from "@/controller/user/wishlist";
import { WishlistItem } from "@/types/wishlist/wishlist";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const MyWishlist = () => {
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });

  // Corrected: wishlist should be an array of WishlistItem
  const [wishlist, setWishlist] = useState<WishlistItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchDashboard = async () => {
    try {
      const response = await GetListWishlist();
      if (response.ok) {
        const json = await response.json();
        setWishlist(json.data); // Ensure json.data is an array
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  return (
    <div className="relative h-full w-full overflow-y-auto">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />

      {/* Wishlist Content */}
      {loading ? (
        <p>Loading wishlist...</p>
      ) : (
        <div>
          {wishlist?.length === 0 ? (
            <p>Your wishlist is empty.</p>
          ) : (
            <ul>
              {wishlist?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    router.push(`/shop/${item.product?.slug}`);
                  }}
                  className="relative my-2 flex w-full items-center justify-between rounded-md border border-gray-50 bg-white px-4 py-4 shadow"
                >
                  <div className="flex w-full flex-col">
                    <div className="flex items-start justify-between gap-4 py-4">
                      <div className="flex w-[100%] flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="relative h-24 w-24 overflow-hidden rounded">
                            <Image
                              src={item.product?.image1 || ""}
                              width={100}
                              height={100}
                              objectFit="cover"
                              alt={item.product?.image1 || "Product"}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-base font-bold">
                              {item.product?.name}
                            </span>

                            <span className="text-base font-bold">
                              {item.product?.subDescriptions}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex w-[50%] flex-col items-end justify-end gap-1">
                        <span className="text-sm font-bold text-gray-500">
                          Harga
                        </span>
                        <span className="text-sm font-bold">
                          <FormatRupiah price={item.product.priceIDR || 0} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
