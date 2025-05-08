import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import React from "react";
import Image from "next/image";
import { FormatRupiah } from "../FormatRupiah";
import { AxiosError } from "axios";

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
  product: Products;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  trackingDetails?: Tracking | null | undefined;
  transactionDetails?: Transaction[];
  error?: AxiosError | string;
  orders?: Order;
}

interface InvoiceProps {
  orders: Order | undefined;
  transactionDetails: Transaction[] | undefined;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  loading,
  trackingDetails,
  transactionDetails,
  error,
  orders,
}) => {
  const generateOrderDetailsPDF = (
    transactionDetails: Transaction[],
    orders: Order
  ) => {
    const doc = new jsPDF();

    const logoUrl = "/logo-echo.png";

    doc.addImage(logoUrl, "PNG", 15, 10, 50, 25);

    doc.setFont("domaine", "normal");
    doc.setFontSize(20);

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.text("Order Summary", pageWidth - 15, 20, { align: "right" });

    const logoBottom = "/icon-flower.png";

    const logoWidth = 175;
    const logoHeight = 175;

    doc.addImage(
      logoBottom,
      "PNG",
      pageWidth - logoWidth + 40,
      pageHeight - logoHeight + 40,
      logoWidth,
      logoHeight
    );

    doc.setFontSize(12);
    doc.setFont("domaine", "normal");

    const orderDate = moment(
      transactionDetails
        ? transactionDetails[0].createdAt
        : "Date not available"
    ).format("DD MMMM YYYY, HH:mm");

    const labelWidth = Math.max(
      doc.getTextWidth("Order Date:"),
      doc.getTextWidth("Order ID:"),
      doc.getTextWidth("Status:")
    );

    const startX = 17;
    const valueX = startX + labelWidth + 2;
    const startY = 52;

    doc.text(`Order Date`, startX, startY);
    doc.text(`: ${orderDate}`, valueX, startY);

    doc.text(`Order ID`, startX, startY + 5);
    doc.text(`: ${orders.orderId}`, valueX, startY + 5);

    doc.text(`Status`, startX, startY + 10);
    const status = orders.status;
    let statusColor: [number, number, number]; // Format RGB

    if (status === "PENDING") {
      statusColor = [255, 165, 0];
    } else if (status === "SUCCESS") {
      statusColor = [34, 197, 94];
    } else if (status === "DECLINE") {
      statusColor = [107, 114, 128];
    } else {
      statusColor = [156, 163, 175];
    }
    doc.setTextColor(...statusColor);
    doc.text(`: ${status}`, valueX, startY + 10);
    doc.setTextColor(0, 0, 0);

    if (!transactionDetails || transactionDetails.length === 0) {
      alert("Tidak ada produk dalam transaksi.");
      return;
    }

    if (trackingDetails) {
      doc.setFont("domaine", "bold");
      doc.text("Shipping Information", 17, 70);
      doc.setFont("domaine", "normal");

      const labelX = 17;
      const valueX = 38;

      doc.text("Courier", labelX, 82);
      doc.text(`: ${trackingDetails.courier.company}`, valueX, 82);

      doc.text("No Resi:", labelX, 86);
      doc.text(`: ${trackingDetails.waybill_id}`, valueX, 86);

      doc.text("Address:", labelX, 90);
      doc.text(`: ${trackingDetails.destination.address}`, valueX, 90);
    } else if (orders) {
      doc.setFont("domaine", "bold");
      doc.text("Shipping Information", 17, 75);
      doc.setFont("domaine", "normal");

      const labelX = 17;
      const valueX = 38;

      doc.text("Courier", labelX, 82);
      doc.text(`: ${orders.Shipment.couriers.name.toUpperCase()}`, valueX, 82);
    }

    doc.setFont("domaine", "bold");
    doc.text("Payment Details", 17, 94);
    doc.setFont("domaine", "normal");

    const labelX = 17;
    const valueTabX = 50;

    doc.text("Payment Method", labelX, 102);
    doc.text(`: ${orders?.paymentType || "Not Available"}`, valueTabX, 102);

    doc.text("Shipping Price", labelX, 108);
    doc.text(
      `: Rp ${orders?.Shipment.price.toLocaleString("id-ID") || 0}`,
      valueTabX,
      108
    );

    const products = transactionDetails.map((item) => ({
      image: item.products?.image1 || "",
      name: item.products?.name || "No Name",
      price: item.products?.priceIDR || 0,
      quantity: item.quantity || 1,
      total: (item.products?.priceIDR || 0) * (item.quantity || 1),
    }));

    const tableData = products.map((item) => [
      { content: "", image: item.image },
      item.name,
      `Rp ${item.price.toLocaleString("id-ID")}`,
      item.quantity,
      `Rp ${item.total.toLocaleString("id-ID")}`,
    ]);

    const shippingCost = orders.Shipment?.price || 0;
    const grandTotal = (orders.amount || 0) + shippingCost;
    const courierCompany =
      orders.Shipment?.couriers?.company.charAt(0).toUpperCase() +
      orders.Shipment?.couriers?.company.slice(1);

    // Tambahkan harga ongkir ke tabel
    tableData.push([
      { content: "", image: "" },
      "",
      "",
      "Shipping Cost",
      `Rp ${shippingCost.toLocaleString("id-ID")}`,
    ]);

    tableData.push([
      "",
      "",
      "",
      { content: "Grand Total", styles: { fontStyle: "bold" } } as any,
      {
        content: `Rp ${grandTotal.toLocaleString("id-ID")}`,
        styles: { fontStyle: "bold" },
      } as any,
    ]);

    const finalTableY = (doc as any).autoTable({
      startY: 120,
      head: [["Image", "Product", "Price", "Quantity", "Total"]],
      body: tableData,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [200, 182, 157], halign: "center" },
      bodyStyles: { fillColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 60, halign: "left" },
        2: { cellWidth: 40, halign: "center" },
        3: { cellWidth: 30, halign: "center" },
        4: { cellWidth: 40, halign: "center" },
      },
      didDrawCell: (data: any) => {
        if (data.column.index === 0 && data.cell.raw.image) {
          const img = document.createElement("img");
          img.src = data.cell.raw.image;
          doc.addImage(img, "JPEG", data.cell.x + 2, data.cell.y + 2, 16, 16);
        }
      },
    }).lastAutoTable.finalY;

    doc.setFont("domaine", "italic");
    doc.text("Thank you for your purchase!", 17, 270);
    doc.text("If you have any questions, feel free to contact us.", 17, 280);
    doc.save(`Invoice-${orders.orderId}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col gap-4 rounded-lg bg-white p-8 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-6 top-2 font-domaine text-2xl"
        >
          X
        </button>
        <div className="hide-scroll h-[30rem] w-[35rem] overflow-auto">
          <h2 className="text-center font-domaine text-xl font-bold text-[#C1AE94]">
            Order Summary
          </h2>
          {/* <hr className="my-0 border-t-[0.5px] border-gray-400" /> */}
          {transactionDetails && transactionDetails.length > 0 && orders ? (
            <div className="flex flex-col gap-2 py-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <span className="font-domaine text-[14px] text-[#231F20]">
                      Order ID :
                    </span>
                    <span className="font-josefins text-[16px] font-semibold text-[#231F20]">
                      {orders.orderId || "Order ID not available"}
                    </span>
                  </div>
                  <div className="flex h-full w-full items-end justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        Order Date :
                      </span>
                      <span className="font-josefins text-[16px] font-semibold text-[#231F20]">
                        {moment(
                          transactionDetails[0].createdAt ||
                            "Date not available"
                        ).format("DD MMMM YYYY, HH:mm")}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (!transactionDetails || !orders) {
                          alert("Data transaksi belum tersedia!");
                          return;
                        }
                        generateOrderDetailsPDF(transactionDetails, orders);
                      }}
                      className={`transform rounded-[4px] bg-gradient-to-t from-[#B69B78] to-[#CDB698] 
                        px-4 py-1 font-domaine text-[16px] text-white transition-all duration-300 ease-in-out`}
                    >
                      Invoice
                    </button>
                  </div>
                </div>

                {trackingDetails ? (
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        Order ID :
                      </span>
                      <span className="font-josefins text-[16px] font-semibold text-[#C1AE94]">
                        {trackingDetails.order_id || "Order ID not available"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        Status :
                      </span>
                      <span className="font-josefins text-[16px] font-semibold uppercase text-[#231F20]">
                        {trackingDetails.status || "Status not available"}
                      </span>
                    </div>
                  </div>
                ) : null}
                <hr className="my-1 border-t-[0.5px] border-gray-400" />
              </div>
              {trackingDetails ? (
                <div className="flex flex-col gap-4 py-2">
                  <span className="font-domaine text-[14px] font-semibold text-[#231F20]">
                    Track Order
                  </span>
                  <div className="ml-2 flex flex-col">
                    {trackingDetails.history.map((item, index) => (
                      <div key={index} className="relative flex flex-col">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <span className="relative flex h-3 w-3">
                              <span
                                className={`absolute inline-flex h-full w-full ${index === 0 ? "animate-ping" : ""} rounded-full ${
                                  index === 0
                                    ? "bg-green-300 opacity-75"
                                    : "bg-gray-300 opacity-50"
                                }`}
                              />
                              <span
                                className={`relative inline-flex h-3 w-3 rounded-full ${index === 0 ? "bg-green-400" : "bg-gray-400"}`}
                              />
                            </span>
                          </div>
                          <div className="flex flex-col pb-4">
                            <span className="text-sm font-semibold text-[#231F20]">
                              {moment(
                                item.updated_at || "Date not available"
                              ).format("DD MMMM YYYY, HH:mm")}
                            </span>
                            <span className="text-xs text-gray-500">
                              {item.note || "Status not available"}
                            </span>
                          </div>
                        </div>
                        {index !== trackingDetails.history.length - 1 && (
                          <div className="absolute left-[5px] top-3 h-full border-l-2 border-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="flex h-[8rem] flex-col gap-2">
                <span className="font-domaine text-[14px] font-semibold text-[#231F20]">
                  Product Details
                </span>
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <div className="relative h-36 w-36 overflow-hidden rounded">
                      <Image
                        src={transactionDetails[0].products?.image1 || ""}
                        width={100}
                        height={100}
                        objectFit="cover"
                        alt={transactionDetails[0].products?.name || "Product"}
                      />
                    </div>
                    <div className="flex w-full flex-col gap-1">
                      <span className="text-sm font-bold">
                        {transactionDetails[0].products?.name || "Product Name"}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="mb-2">
                          <div className="flex items-end justify-end">
                            {transactionDetails[0].products?.Discount?.length >
                              0 &&
                            transactionDetails[0].products?.Discount[0]
                              ?.discount ? (
                              <div className="flex flex-row items-end justify-center gap-2">
                                {/* Harga asli dicoret */}
                                <span className="text-gray-500 line-through">
                                  <FormatRupiah
                                    price={
                                      transactionDetails[0].products
                                        ?.priceIDR || 0
                                    }
                                  />
                                </span>

                                {/* Harga setelah diskon */}
                                <FormatRupiah
                                  price={
                                    (transactionDetails[0].products?.priceIDR ||
                                      0) -
                                    (transactionDetails[0].products?.priceIDR ||
                                      0) *
                                      (transactionDetails[0].products
                                        ?.Discount[0]?.discount ?? 0)
                                  }
                                />

                                {/* Persentase diskon */}
                                <span className="text-red-500">
                                  {`${(
                                    (transactionDetails[0].products?.Discount[0]
                                      ?.discount ?? 0) * 100
                                  ).toFixed(0)}% Off`}
                                </span>
                              </div>
                            ) : (
                              <FormatRupiah
                                price={
                                  transactionDetails[0].products?.priceIDR || 0
                                }
                              />
                            )}
                          </div>
                        </div>

                        <span>x</span>
                        <span>{transactionDetails[0].quantity} Items</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full w-[25%] flex-col justify-between">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-josefins text-sm text-[#231F20]">
                        Total Harga
                      </span>
                      <span className="text-[16px] font-bold">
                        <FormatRupiah
                          price={
                            transactionDetails[0].products!.Discount.length > 0
                              ? transactionDetails[0].products!.Discount[0]
                                  .productPrice *
                                (transactionDetails[0].quantity || 0)
                              : (transactionDetails[0].products!.priceIDR ||
                                  0) * (transactionDetails[0].quantity || 0)
                          }
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-1 border-t-[0.5px] border-gray-400" />

              {transactionDetails[0].status === "NEW" && (
                <div className="flex h-[8rem] flex-col gap-2">
                  <span className="font-domaine text-[14px] font-semibold text-[#231F20]">
                    Delivery Information
                  </span>
                  <div className="flex flex-row gap-2">
                    <div className="flex w-[6rem] flex-row justify-between">
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        Courier
                      </span>
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        :
                      </span>
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        {orders.Shipment.couriers.company
                          .charAt(0)
                          .toUpperCase() +
                          orders.Shipment.couriers.company.slice(1)}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {trackingDetails ? (
                <div className="flex h-[8rem] flex-col gap-2">
                  <span className="font-domaine text-[14px] font-semibold text-[#231F20]">
                    Delivery Information
                  </span>
                  <div className="flex flex-row gap-2">
                    <div className="flex w-[6rem] flex-row justify-between">
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        Courier
                      </span>
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        :
                      </span>
                    </div>
                    <span className="font-domaine text-[14px] text-[#231F20]">
                      {trackingDetails.courier.company.charAt(0).toUpperCase() +
                        trackingDetails.courier.company.slice(1)}{" "}
                      -{" "}
                      {trackingDetails.history[0].service_type
                        .charAt(0)
                        .toUpperCase() +
                        trackingDetails.history[0].service_type.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="flex w-[6rem] flex-row justify-between">
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        No Resi
                      </span>
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        :
                      </span>
                    </div>
                    <span className="font-domaine text-[14px] text-[#231F20]">
                      {trackingDetails.waybill_id}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="flex w-[10rem] flex-row justify-between">
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        Address
                      </span>
                      <span className="font-domaine text-[14px] text-[#231F20]">
                        :
                      </span>
                    </div>
                    <span className="font-domaine text-[14px] text-[#231F20]">
                      {trackingDetails.destination.address}
                    </span>
                  </div>
                </div>
              ) : null}
              <hr className="my-1 border-t-[0.5px] border-gray-400" />
              <div className="flex h-[8rem] flex-col gap-2">
                <span className="font-domaine text-[14px] font-semibold text-[#231F20]">
                  Rincian Pembayaran
                </span>
                <div className="flex flex-row justify-between">
                  <span className="font-domaine text-[14px] text-[#231F20]">
                    Metode Pembayaran
                  </span>
                  <span className="font-domaine text-[14px] text-[#231F20]">
                    {orders.paymentType}
                  </span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="font-domaine text-[14px] text-[#231F20]">
                    Subtotal Harga Barang
                  </span>
                  <FormatRupiah
                    price={
                      transactionDetails[0].products!.Discount.length > 0
                        ? transactionDetails[0].products!.Discount[0]
                            .productPrice *
                          (transactionDetails[0].quantity || 0)
                        : (transactionDetails[0].products!.priceIDR || 0) *
                          (transactionDetails[0].quantity || 0)
                    }
                  />
                </div>
                <div className="flex flex-row justify-between">
                  <span className="font-domaine text-[14px] text-[#231F20]">
                    Total Ongkos Kirim
                  </span>
                  <span className="font-domaine text-[14px] text-[#231F20]">
                    <FormatRupiah price={orders.Shipment.price || 0} />
                  </span>
                </div>
              </div>
              <hr className="my-1 border-t-[0.5px] border-gray-400" />
              <div className="flex w-full flex-row justify-between">
                <span className="font-domaine text-xl font-semibold text-[#231F20]">
                  Total Belanja
                </span>
                <span className="font-domaine text-xl text-[#231F20]">
                  <FormatRupiah price={orders.amount || 0} />
                </span>
              </div>

              {orders.status === "PENDING" ? (
                <a
                  href={orders.link}
                  rel="noopener noreferrer"
                  className="mt-4 w-full appearance-none rounded bg-gradient-to-t from-[#FFA500] to-[#FFC078] px-6 py-3 text-center text-sm font-bold text-white no-underline outline-none hover:text-white hover:no-underline"
                >
                  Payment Link
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
