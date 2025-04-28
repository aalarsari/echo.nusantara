"use server";
import { Session } from "next-auth/core/types";
import { io } from "socket.io-client";

export async function Socket(session: Session) {

  var socket = io(process.env.PAYMENT_URL!, {
    query: {
      userId: session.user.userId,
    },
  });
  setTimeout(() => {
    socket.close();
  }, 250);
}
