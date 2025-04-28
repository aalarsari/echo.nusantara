namespace NodeJS {
   interface ProcessEnv {
      NEXTAUTH_URL?: string;
      APP_URL?: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      GOOGLE_MAP_KEY?: string;
      GOOGLE_REFRESH_TOKEN?: string;


      PAYMENT_URL?: string;

      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASSWORD?: string;
      SMTP_FROM_EMAIL?: string;
      SMTP_SERVICE?: string;

      CASHLESS_PRIVATE_KEY?: string;
      CASHLESS_URL?: string;
      CASHLESS_VENDOR_IDENTIFIER?: string;
      CASHLESS_VENDOR_ENTITYID?: string;
      CASHLESS_VENDOR_USERNAME?: string;

      BITSHIP_URL?: string;
      BITSHIP_TOKEN_API?: string;

      PAYPAL_URL?: string;
      PAYPAL_CLIENT_ID?: string;
      PAYPAL_SECRET_KEY?: string;
      PAYPAL_RETRUN_URL?: string;
      PAYPAL_CANCEL_CALLBACK_URL?: string;
      PAYPAL_CALLBACK_DATA_URL?: string;
   }
}
