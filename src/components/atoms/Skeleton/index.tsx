import React from "react";

interface SkeletonProps {
  number: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ number }) => {
  return (
    <>
      {Array(number)
        .fill(0)
        .map((_, index) => (
          <div key={index}>
            <div className="flex w-[20rem] flex-row items-center gap-2 rounded border-r-4 bg-white p-2 shadow-lg">
              <div className="h-[4.5rem] w-[4.5rem] animate-pulse rounded-full bg-gray-300"></div>
              <div className="flex w-9/12 flex-col gap-2">
                <span className="h-2 w-11/12 animate-pulse rounded-full bg-gray-300"></span>
                <span className="h-2 w-9/12 animate-pulse rounded-full bg-gray-300"></span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
