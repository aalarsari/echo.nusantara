interface ValidatePayment {
   status: string;
   message: string;
   timestamp: string;
   data: Data;
}

interface Data {
   response: Response;
}

interface Response {
   amount: number;
   callbackFailure: string;
   callbackSuccess: string;
   checkLocation: boolean;
   createdDate: string;
   currencyCode: string;
   description: string;
   entityId: string;
   expiredDate: string;
   generatedUrl: string;
   id: number;
   merchantDescription: string;
   merchantName: string;
   paymentTypes: PaymentType[];
   paymentType: PaymentType;
   processStatus: string;
   referenceId: string;
   requestMessage: string;
   status: string;
   transactionUsername: string;
   vendor: Vendor;
}

interface PaymentType {
   id: number;
   code: string;
   name: string;
}

interface Vendor {
   id: number;
   colorTheme: string;
   frontendUrl: string;
   callbackUrl: string;
   vendorIdentifier: string;
   entityId: string;
   transactionUsername: string;
   name: string;
   endpointId: string;
   serverKeyId: string;
   urlExpiredTime: number;
   createdDate: string;
   active: boolean;
}
