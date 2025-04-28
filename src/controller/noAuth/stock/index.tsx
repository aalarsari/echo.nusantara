export async function GetStock(id: number) {
  var response = await fetch(`/api/stock?productId=${id}`);
  return response;
}
