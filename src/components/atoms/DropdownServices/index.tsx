import React from "react";
import { FormatRupiah } from "../FormatRupiah";

type DropdownServicesProps = {
  services: string[];
  selectedService: string | undefined;
  onSelectService: (service: string) => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  cartHome: any;
  selectedCourier: string | undefined;
};

export const DropdownServices: React.FC<DropdownServicesProps> = ({
  services,
  selectedService,
  onSelectService,
  isDropdownOpen,
  toggleDropdown,
  cartHome,
  selectedCourier,
}) => {
  return (
    <div className="relative">
      <div
        className="flex h-[50px] w-full cursor-pointer items-center justify-start rounded-md border border-gray-300 px-4 py-2"
        onClick={toggleDropdown}
      >
        <span className="block font-josefins text-gray-600">
          {selectedService || "Select Service"}
        </span>
      </div>

      {isDropdownOpen && (
        <div className="absolute left-0 z-10 mt-2 h-auto w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {services.map((service, index) => {
            const servicePrice = cartHome?.shipmentPrice?.find(
              (item: any) =>
                item.courier_service_name === service &&
                item.courier_code === selectedCourier,
            )?.price;

            return (
              <div
                key={index}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => onSelectService(service)}
              >
                <div className="flex justify-between">
                  <span>{service}</span>
                  <span className="text-gray-500">
                    <FormatRupiah
                      price={servicePrice ? servicePrice : "No price available"}
                    />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
