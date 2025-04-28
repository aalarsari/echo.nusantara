import { google } from "googleapis";
import nodemailer from "nodemailer";

export const SendEmail = async (data: EmailPayload) => {
   const OAuth2 = google.auth.OAuth2;

   const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.APP_URL);
   oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
   });
   const accessToken = await oauth2Client.getAccessToken();
   const option = {
      service: "gmail",
      port: 465,
      auth: {
         user: process.env.SMTP_USER,
         type: "OAUTH2",
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
         accessToken: accessToken.token,
         refreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
      },
   };
   const transporter = nodemailer.createTransport(option as any);
   const send = await transporter.sendMail({
      subject: data.subject,
      to: data.to,
      html: data.html,
      from: process.env.SMTP_FROM_EMAIL,
      attachments: data.attachment,
   });

   return send;
};
