export async function SearchBar(data: string) {
  var response = await fetch(`/api/search-bar?data=${data}`);
  return response;
}
