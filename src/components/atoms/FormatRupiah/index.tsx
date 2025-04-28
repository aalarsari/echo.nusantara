import React from "react";
import currency from "currency.js";

interface FormatRupiahProps {
  price: number;
  size?: string;
}

export const FormatRupiah: React.FC<FormatRupiahProps> = ({ price, size }) => {
  const formattedValue = currency(price, {
    symbol: "Rp ",
    precision: 0,
    separator: ".",
    decimal: ",",
  }).format();

  return (
    <span className={`font-josefins font-semibold text-[#231F20] ${size}`}>
      {formattedValue}
    </span>
  );
};
