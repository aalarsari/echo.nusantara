enum OrderBy {
  id = "id",
  orderId = "orderId",
  createdAt = "createdAt",
  status = "status",
}
enum OrderByDirection {
  asc = "asc",
  desc = "desc",
}

interface orderByTranscation {
  orderDirections: OrderByDirection;
  orderby: OrderBy;
}
