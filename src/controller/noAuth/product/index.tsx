export async function ProductController() {
  var response = await fetch(`/api/product`);
  return response;
}
