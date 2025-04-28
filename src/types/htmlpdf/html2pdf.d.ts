declare module "html2pdf.js" {
  interface Html2PdfOptions {
    filename: string;
    margin: number | string;
    html2canvas: object;
    jsPDF: object;
  }

  function html2pdf(
    element: HTMLElement | string,
    options?: Html2PdfOptions,
  ): void;

  export = html2pdf;
}
