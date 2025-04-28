export async function GetListComplaintAdmin() {
  var response = await fetch("/api/admin/complaint");
  return response;
}

export async function ConfirmComplaint(id: number) {
  var response = await fetch(`/api/admin/complaint/${id}/confirm`);
  return response;
}

export async function DoneComplaint(id: number) {
  var response = await fetch(`/api/admin/complaint/${id}/done`);
  return response;
}
