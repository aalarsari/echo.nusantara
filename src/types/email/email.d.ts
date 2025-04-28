interface EmailPayload {
   to: string;
   subject: string;
   html: string;
   attachment?: Attachment[];
}
interface Attachment {
   filename: string;
   path: string;
}
