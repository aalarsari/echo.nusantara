import Link from "next/link";

export default function FailedPaymentPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <div>
        <h2 className="font-semibold text-black">Failed Payment</h2>
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
