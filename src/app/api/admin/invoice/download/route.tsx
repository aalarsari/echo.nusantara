// import prisma from "@/database/prisma";
// import Invoice from "@/lib/pdf/template/invoice";
// import ReactPDF from "@react-pdf/renderer";
import { NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//    var orderId = request.nextUrl.searchParams.get("orderId")?.trim();

//    var payment = await prisma.payments.findFirst({
//       where: {
//          status: "SUCCESS",
//          orderId: orderId,
//       },
//       select: {
//          transaction: {
//             select: {
//                products: true,
//                quantity: true,
//                createdAt: true,
//                status: true,
//             },
//          },
//          id: true,
//          amount: true,
//          orderId: true,
//          createdAt: true,
//          status: true,
//          updatedAt: true,
//       },
//    });

//    var stream = await ReactPDF.renderToStream(Invoice(payment!));

//    const chunks = [];
//    for await (const chunk of stream) {
//       chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
//    }
//    const buffer = Buffer.concat(chunks);

//    return new NextResponse(buffer, {
//       headers: {
//          "Content-Type": "application/pdf",
//       },
//    });
// }

export async function GET() {
  return NextResponse.json({
    error: false,
    message: null,
    data: null,
  });
}
