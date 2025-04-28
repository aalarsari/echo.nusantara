import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface Option {
  id: number;
  name: string;
}

interface CustomDropdownProps {
  options: Option[];
  register: (...args: any[]) => any;
  name: string;
  control: any;
  inputProps: Record<string, any>;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  inputProps,
  name,
  control,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  return (
    <div className="relative">
      <div className="relative">
        <div
          className="flex w-[350px] cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white p-2 md:w-full"
          onClick={toggleDropdown}
        >
          <span>{selectedOption ? selectedOption.name : "Select Option"}</span>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
        {isOpen && (
          <div className="absolute top-full z-10 mt-1 w-[350px] rounded-md border border-gray-300 bg-white shadow-md md:w-full">
            {options.map((option) => (
              <div
                key={option.id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, ...field } }) => (
          <input
            type="hidden"
            {...field}
            value={selectedOption ? selectedOption.id : ""}
          />
        )}
      />
    </div>
  );
};
