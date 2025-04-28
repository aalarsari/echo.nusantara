"use server";

import { cookies } from "next/headers";

export async function Logout() {
  cookies().delete("next-auth.session-token");
}
