import React from "react";

interface InputPhotoProps {
  placeholder: string;
  register: any;
  inputProps: Record<string, any>;
  error?: string;
  width?: string;
  height?: string;
}

export const InputPhoto: React.FC<InputPhotoProps> = ({
  placeholder,
  register,
  inputProps,
  error,
  width,
  height,
}) => {
  return (
    <div className="relative flex flex-col gap-1">
      <input
        type="file"
        placeholder={placeholder}
        accept="image/*"
        {...register(inputProps.name, {
          required: `${placeholder} is required`,
        })}
        {...inputProps}
        className={`appearance-none rounded-md border-2 border-white bg-[#1C2D34]/40 px-4 py-3 text-white outline-none ${width} ${height}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
