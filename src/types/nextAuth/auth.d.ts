import { Role } from "@prisma/client";
import { DefaultUser, ISODateString, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface DefaultUser {
    role?: string;
    name?: string;
    email?: string | null;
    phone?: string;
    photo?: string;
    userId?: string;
    sessionId?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      userId?: string;
      role?: Role;
      name?: string;
      email?: string | null;
      phone?: string;
      photo?: string;
      sessionId?: string;
      userId?: string;
    };
  }
}
