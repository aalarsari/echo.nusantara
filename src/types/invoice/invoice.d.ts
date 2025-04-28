import { Prisma, $Enums } from "@prisma/client";
import { TransformationContext } from "typescript";

interface InvoiceItem {
   orderId: string;
   id: number;
   amount: number;
   status: $Enums.PaymentStatus;
   createdAt: Date;
   updatedAt: Date;
   user: User;
   transaction: Transaction[];
}
