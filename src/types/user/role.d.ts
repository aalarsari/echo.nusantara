import { z } from "zod";
import { role } from "@/lib/zod-schema/user";

type Role = z.infer<role>;
