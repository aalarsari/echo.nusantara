// Filter

export async function getListShop(
  pageSize: number,
  page: number,
  cataegoryId?: number,
) {
  var url;
  if (cataegoryId) {
    url = `/api/shop?page=${page}&pageSize=${pageSize}&category=${cataegoryId}`;
  } else {
    url = `/api/shop?page=${page}&pageSize=${pageSize}`;
  }
  var res = await fetch(url);
  return res;
}

export async function DetailShop(slug: string) {
  var response = await fetch(`/api/shop/${slug}`, {
    method: "GET",
  });
  return response;
}
