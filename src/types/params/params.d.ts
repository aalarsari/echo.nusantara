interface Params {
   page?: number;
   pageSize?: number;
}

interface ListTransactionParams extends Params {
   filterBy?: string;
   filterWith?: string;
   startDate?: string;
   endDate?: string;
   search?: string;
}

interface ListPaymentParams extends Params {
   startDate?: string;
   endDate?: string;
}
