import { sendNotificationValidation } from "@/lib/zod-schema/sendNotification";
import { Container, Html, Section, Text } from "@react-email/components";
import { z } from "zod";

export default function SendNotification(data?: z.infer<typeof sendNotificationValidation>) {
   return (
      <Html lang="en" dir="ltr">
         <Section>
            <Container>
               <Text></Text>
            </Container>
         </Section>
      </Html>
   );
}
