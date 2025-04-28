"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
      {/* <div>
        <Image src={Assets.NotFound} alt="Not Found" width={600} height={600} />
      </div> */}
      <div>
        <h2 className="font-semibold text-black">{error.message}</h2>
      </div>
      <div>
        <Link
          href="/"
          className="h-[2.5rem] w-[6.5rem] rounded-md bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-95"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
