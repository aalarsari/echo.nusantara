import { createSign, createVerify, constants } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import axios, { Axios, HttpStatusCode, isAxiosError } from "axios";
import moment from "moment-timezone";
import fs from "fs";

const flagNew = { flag: "wx" };

export async function PaymentDataCashless(
  total: number,
  orderId: string,
  tokenSuccess: string,
  tokenFailed: string,
) {
  const publicKey = await readFile(
    "./src/assets/key/merchant_public.pem",
    "utf8",
  );
  const privateKey = await readFile(
    "./src/assets/key/merchant_private.pem",
    "utf8",
  );

  var payload = {
    data: {
      request: {
        vendorIdentifier: process.env.CASHLESS_VENDOR_IDENTIFIER,
        //   vendorIdentifier: "CZ00EXT004",
        referenceId: orderId,
        entityId: process.env.CASHLESS_VENDOR_ENTITYID,
        //   entityId: "23273",
        merchantName: "Cashlez Alam Anugerah",
        merchantDescription: "Jl. Letjen. S. Parman No.28",
        currencyCode: "IDR",
        amount: total,
        //   amount: 1,
        callbackSuccess: `${process.env.APP_URL}/api/payment/success?orderId=${orderId}&token=${tokenSuccess}`,
        callbackFailure: `${process.env.APP_URL}/api/payment/cancel?orderId=${orderId}&token=${tokenFailed}`,
        message: `Transaction for ${orderId}`,
        description: `Transaction for ${orderId}`,
        transactionUsername: process.env.CASHLESS_VENDOR_USERNAME,
        //   transactionUsername: "Test03",
      },
    },
    signature: "",
  };

  var dataToSign = JSON.stringify(payload.data);

  var result = signWithPayload(dataToSign, privateKey, publicKey);
  payload.signature = `${result}`;

  try {
    var res = await axios.request({
      url: `${process.env.CASHLESS_URL}generate_url_vendor`,
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const logDirectory = path.join("./logs");
      const filePath = path.join(logDirectory, "error-log.log");
      // Create the directory if it doesn't exist
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
      }
      // Axios-specific error handling
      console.error("Axios error:", error.message);
      console.error("Error response data:", error.response?.data);
      if (!fs.existsSync(filePath)) {
        const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
        fs.writeFileSync(filePath, message, flagNew);
      } else {
        const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
        fs.appendFileSync(filePath, message);
      }
      throw new Error(error.message);
    } else {
      const logDirectory = path.join("./logs");
      const filePath = path.join(logDirectory, "error-log.log");
      // Create the directory if it doesn't exist
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
      }
      // Axios-specific error handling
      if (!fs.existsSync(filePath)) {
        const message = `[${moment.tz().format()}] ${error} \n`;
        fs.writeFileSync(filePath, message, flagNew);
      } else {
        const message = `[${moment.tz().format()}] ${error} \n`;

        fs.appendFileSync(filePath, message);
      }
    }
  }
}

export async function GetDetailPaymentCashlezz(
  linkPayment: string,
): Promise<ValidatePayment> {
  var payload = {
    data: {
      request: {
        generatedUrl: linkPayment.trim(),
      },
    },
  };
  try {
    const res = await axios.request({
      url: `${process.env.CASHLESS_URL}validate_url`,
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    var data = res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const logDirectory = path.join("./logs");
      const filePath = path.join(logDirectory, "error-log.log");
      // Create the directory if it doesn't exist
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
      }
      // Axios-specific error handling
      console.error("Axios error:", error.message);
      console.error("Error response data:", error.response?.data);
      if (!fs.existsSync(filePath)) {
        const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
        fs.writeFileSync(filePath, message, flagNew);
      } else {
        const message = `[${moment.tz().format()}] ${error.message ?? error.response?.data} \n`;
        fs.appendFileSync(filePath, message);
      }
      throw new Error(error.message);
    } else {
      const logDirectory = path.join("./logs");
      const filePath = path.join(logDirectory, "error-log.log");
      // Create the directory if it doesn't exist
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
      }
      // Axios-specific error handling
      if (!fs.existsSync(filePath)) {
        const message = `[${moment.tz().format()}] ${error} \n`;
        fs.writeFileSync(filePath, message, flagNew);
      } else {
        const message = `[${moment.tz().format()}] ${error} \n`;

        fs.appendFileSync(filePath, message);
      }
    }
  }
  return data;
}

export function signWithPayload(
  payload: string,
  privateKey: string,
  publicKey: string,
): string {
  // Convert the payload to a Buffer
  const payloadBuffer = Buffer.from(payload);
  //  Create a sign object with SHA256 and RSA
  const sign = createSign("RSA-SHA256");

  // Add the payload to the sign object
  sign.update(payloadBuffer);
  // Generate the signature using the provided private key
  sign.end();
  const signature = sign.sign(
    {
      key: privateKey,
    },
    "base64",
  );

  return signature;
}
