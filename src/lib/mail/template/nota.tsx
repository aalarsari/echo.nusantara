import { NextRequest } from "next/server";
import { Section } from "@react-email/section";
import { Text, Html, Container } from "@react-email/components";
import styles from "./email.module.css";
import { InvoiceItem } from "@/types/invoice/invoice";

export default function Nota(data: InvoiceItem) {
   return (
      <Html>
         <Section>
            <Container></Container>
         </Section>
      </Html>
   );
}
