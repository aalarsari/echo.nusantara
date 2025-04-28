import axios, { Axios, HttpStatusCode, isAxiosError } from "axios";
import moment from "moment-timezone";
import path from "path";
import fs from "fs";

// ini biar dapat pricing
const flagNew = { flag: "wx" };

export async function GetShipmentPrice(body: ShipmentPrice) {
   try {
      var header = {
         authorization: process.env.BITSHIP_TOKEN_API!,
         "content-type": "application/json",
      };
      var res = await axios.request({
         url: `${process.env.BITSHIP_URL}v1/rates/couriers`,
         method: "POST",
         headers: header,
         data: body,
      });
      var data: CourierPricingResponse = res.data;
      if (res.status == HttpStatusCode.Ok) {
         return data;
      }
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
