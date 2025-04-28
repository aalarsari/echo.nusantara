import React from "react";

interface InputFieldProps {
  type: string;
  label?: string;
  placeholder: string;
  register: any;
  inputProps: Record<string, any>;
  error?: string;
  width?: string;
  height?: string;
  color?: string;
  value?: string;
  readOnly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  type,
  label,
  placeholder,
  register,
  inputProps,
  error,
  width,
  height,
  color,
  value,
  onChange,
  readOnly,
}) => {
  return (
    <div className="relative flex w-full flex-col gap-2">
      <label
        htmlFor={inputProps.name}
        className="font-josefins text-[16px] font-semibold text-[#7D716A]"
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        {...register(inputProps.name, {
          required: `${placeholder} is required`,
        })}
        {...inputProps}
        style={{ color: "#000" }}
        readOnly={readOnly}
        className={`appearance-none rounded-md border-[0.5px] border-[#7D716A] bg-[white]/[1%] px-4 py-2.5 font-josefins font-semibold text-[#231F20] placeholder-[#7D716A] outline-none focus:border-[1px] focus:border-[#CDB698] ${width} ${height} ${color}`}
      />
      {error && <p className="font-josefins text-sm text-red-500">{error}</p>}
    </div>
  );
};
