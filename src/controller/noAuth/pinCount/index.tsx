export async function PinCount() {
  var response = await fetch(`/api/count-pin`, {
    method: "GET",
  });
  return response;
}
