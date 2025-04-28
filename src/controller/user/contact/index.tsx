export async function GetListContact() {
  var response = await fetch(`/api/admin/contact`, {
    method: "GET",
  });
  return response;
}
export async function GetDetailContact(id: number) {
  var response = await fetch(`/api/admin/contact/${id}`, {
    method: "GET",
  });
  return response;
}
