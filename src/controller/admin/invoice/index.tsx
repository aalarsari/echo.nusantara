export async function InvoiceData(startDate: string, endDate: string, page: number, pageSize: number) {
  var response = await fetch(`/api/admin/invoice?startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`);
  return response;
}
