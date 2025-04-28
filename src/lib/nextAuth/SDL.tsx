// single device login

import { getCsrfToken } from "next-auth/react";

export async function SingleDeviceLogin(url: any, signOutUrl: any) {
   var getSessionId = await fetch(url);
   var body = await getSessionId.json();
   var sessionId = body.data;

   const fetchOptions = {
      method: "POST",
      headers: {
         "Content-Type": "application/x-www-form-urlencoded",
      },
      // @ts-expect-error
      body: new URLSearchParams({
         csrfToken: await getCsrfToken(),
         json: true,
      }),
   };

   if (!sessionId) {
      const res = await fetch(signOutUrl, fetchOptions);
      const data = await res.json();
      return data;
   }
   return;
}
