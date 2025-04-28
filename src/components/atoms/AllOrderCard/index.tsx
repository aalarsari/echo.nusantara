import Image from "next/image";
import moment from "moment";
import Link from "next/link";

interface Order {
  id: number;
  orderId: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  transaction: Transaction[];
  paymentType: string | null;
  Shipment: {
    price: number;
    couriers: {
      name: string;
      company: string;
    };
  };
  link: string;
}
interface AllOrdersCardProps {
  orders: Order;
  onOpenModal: (id: string, index?: number) => void;
}

export const AllOrdersCard: React.FC<AllOrdersCardProps> = ({
  orders,
  onOpenModal,
}) => {
  return (
    <div className="my-2 flex w-full items-center justify-between rounded-md bg-white px-4 py-4 shadow">
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-black">Order ID: </span>
            <span className="text-sm font-semibold text-[#252525]">
              {orders.orderId}
            </span>
            <div
              className={`rounded px-2 text-sm font-bold ${
                orders.status === "PENDING"
                  ? "bg-[#FFA500]/20 text-[#FFA500]"
                  : orders.status === "SUCCESS"
                    ? "bg-green-100 text-green-500"
                    : orders.status === "DECLINE"
                      ? "bg-gray-300 text-black"
                      : "bg-gray-200 text-gray-500"
              }`}
            >
              {orders.status}
            </div>
          </div>
          <span className="text-sm font-semibold text-[#252525]">
            {moment(orders.updatedAt).format("dddd, DD MMMM YYYY")}
          </span>
        </div>
        <hr className="my-1 border-gray-200" />
        <div className="flex items-end justify-between py-4">
          <div className="flex gap-2">
            <div className="relative h-24 w-24 overflow-hidden rounded">
              <Image
                src={orders.transaction[0]?.products?.image1 || ""}
                width={100}
                height={100}
                objectFit="cover"
                alt={orders.transaction[0]?.products?.name || "Product"}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold">
                {orders.transaction[0]?.products?.name}
              </span>
              <div className="flex items-center gap-2">
                <span>Rp {orders.amount.toLocaleString()}</span>
                <span>x</span>
                <span>{orders.transaction[0]?.quantity} Items</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-bold text-gray-500">
              Total Belanja
            </span>
            <span className="text-sm font-bold">
              Rp {orders.amount.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onOpenModal(orders.orderId)}
            className="text-sm font-semibold text-gray-500 outline-none"
          >
            Lihat Detail Transaksi
          </button>
          {orders.status === "PENDING" ? (
            <a
              href={orders.link}
              target="_blank"
              rel="noopener noreferrer"
              className="appearance-none rounded bg-gradient-to-t from-[#FFA500] to-[#FFC078] px-6 py-2 text-sm font-bold text-white no-underline outline-none hover:text-white hover:no-underline"
            >
              Payment Link
            </a>
          ) : (
            <button className="rounded bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-8 py-2 text-sm font-bold text-white">
              Beli Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
