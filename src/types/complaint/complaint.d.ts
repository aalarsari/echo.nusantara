import { ComplainValidaton } from "@/lib/zod-schema/complaint";
import { z } from "zod";

interface Complaint extends z.infer<typeof ComplainValidaton> {
  [key: string]: any;
}
