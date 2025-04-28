import React from "react";
import Image, { StaticImageData } from "next/image";
import { Assets } from "@/assets";

type DropdownCouriersProps = {
  couriers: string[];
  selectedCourier: string | undefined;
  onSelectCourier: (courierName: string) => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  profile: User;
  showNotification: (message: string, type: "error" | "success") => void;
};

const courierLogos: { [key: string]: StaticImageData } = {
  gojek: Assets.Gojek,
  sicepat: Assets.Sicepat,
  jne: Assets.Jne,
  tiki: Assets.Tiki,
  jnt: Assets.Jnt,
  lalamove: Assets.Lalamove,
  anteraja: Assets.Anteraja,
};

export const DropdownCouriers: React.FC<DropdownCouriersProps> = ({
  couriers,
  selectedCourier,
  onSelectCourier,
  isDropdownOpen,
  toggleDropdown,
  profile,
  showNotification,
}) => {
  return (
    <div className="relative">
      <div
        className="flex h-[50px] w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 px-4 py-2"
        onClick={toggleDropdown}
      >
        {selectedCourier && courierLogos[selectedCourier] ? (
          <Image
            width={60}
            height={60}
            src={courierLogos[selectedCourier]}
            alt={`${selectedCourier} logo`}
          />
        ) : (
          "Select Courier"
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute left-0 z-[99] mt-2 h-auto w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {couriers.length === 0 ? (
            <div className="animate-pulse">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex h-[3rem] cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <div className="ml-4 flex-1 space-y-2">
                      <div className="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            couriers.map((courierName) => (
              <div
                key={courierName}
                className="flex h-[3rem] cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => onSelectCourier(courierName)}
              >
                {courierLogos[courierName] ? (
                  <Image
                    width={60}
                    height={60}
                    src={courierLogos[courierName]}
                    alt={`${courierName} logo`}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
