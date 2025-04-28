import { ComplainValidaton } from "@/lib/zod-schema/complaint";
import { Complaint } from "@/types/complaint/complaint";
import { z } from "zod";

export async function CreateComplaint(data: Complaint) {
  var response = await fetch("/api/user/complaint", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}
export async function GetListComplaintUser() {
  var response = await fetch("/api/user/complaint");
  return response;
}
