import { InvoiceItem } from "@/types/invoice/invoice";
import {
  Document,
  Page,
  View,
  Text,
  Svg,
  Path,
  Image,
} from "@react-pdf/renderer";
import { style } from "../style/style";

export default function Invoice(data: InvoiceItem) {
  return (
    <Document>
      <Page size="A4" style={style.page}>
        <View>{/* <Image source="logo" src={LogoEcho} /> */}</View>
      </Page>
    </Document>
  );
}
