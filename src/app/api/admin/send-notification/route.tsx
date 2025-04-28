import prisma from "@/database/prisma";
import { SendEmail } from "@/lib/mail/email";
import SendNotification from "@/lib/mail/template/sendNotification";
import { sendNotificationValidation } from "@/lib/zod-schema/sendNotification";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  var body = await request.formData();
  try {
    var validation = sendNotificationValidation.parse(body);
    var users = await prisma.subscriber.findMany({});
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      var sendMail = SendEmail({
        to: user.email,
        subject: validation.title,
        html: render(SendNotification(validation)),
      });
      if (!sendMail) {
        break;
      }
    }
    return NextResponse.json({ validation });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
